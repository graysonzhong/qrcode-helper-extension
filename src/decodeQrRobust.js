import jsQR from 'jsqr'

const JSQR_TRY = /** @type {const} */ ([
  { inversionAttempts: /** @type {'attemptBoth'} */ ('attemptBoth') },
  { inversionAttempts: /** @type {'invertFirst'} */ ('invertFirst') },
  { inversionAttempts: /** @type {'onlyInvert'} */ ('onlyInvert') },
])

/** @param {ImageData} imageData */
function tryJsqr(imageData) {
  for (const opts of JSQR_TRY) {
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, opts)
      if (code?.data) return code
    } catch {
      /* jsQR 个别 inversion / 脏图会抛错，降级继续 */
    }
  }
  return null
}

/**
 * @param {ImageData} id
 * @param {number} i
 */
function luminanceAt(id, i) {
  return 0.299 * id.data[i] + 0.587 * id.data[i + 1] + 0.114 * id.data[i + 2]
}

/** @param {ImageData} id */
function cloneImageData(id) {
  return new ImageData(new Uint8ClampedArray(id.data), id.width, id.height)
}

/** @param {ImageData} id */
function meanLuminance(id) {
  let s = 0
  const n = (id.width * id.height) | 0
  for (let i = 0; i < id.data.length; i += 4) {
    s += luminanceAt(id, i)
  }
  return n ? s / n : 128
}

/** @param {ImageData} id */
function histogramLuma(id) {
  const hist = new Uint32Array(256)
  for (let i = 0; i < id.data.length; i += 4) {
    const v = Math.min(255, Math.max(0, luminanceAt(id, i) | 0))
    hist[v] += 1
  }
  return hist
}

/** @param {Uint32Array} grayHist @param {number} total */
function otsuThreshold(grayHist, total) {
  let sum = 0
  for (let i = 0; i < 256; i += 1) sum += i * grayHist[i]
  let sumB = 0
  let wB = 0
  let maxVar = -1
  let threshold = 127
  for (let t = 0; t < 256; t += 1) {
    wB += grayHist[t]
    if (wB === 0) continue
    const wF = total - wB
    if (wF === 0) break
    sumB += t * grayHist[t]
    const mB = sumB / wB
    const mF = (sum - sumB) / wF
    const between = wB * wF * (mB - mF) ** 2
    if (between > maxVar) {
      maxVar = between
      threshold = t
    }
  }
  return threshold
}

/**
 * @param {ImageData} id
 * @param {number} thr
 * @param {boolean} [invert]
 */
function thresholdToBinary(id, thr, invert = false) {
  const out = cloneImageData(id)
  for (let i = 0; i < id.data.length; i += 4) {
    const L = luminanceAt(id, i)
    let dark = L < thr
    if (invert) dark = !dark
    const v = dark ? 0 : 255
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = 255
  }
  return out
}

/** @param {ImageData} id */
function grayscaleImageData(id) {
  const out = cloneImageData(id)
  for (let i = 0; i < id.data.length; i += 4) {
    const L = luminanceAt(id, i) | 0
    out.data[i] = L
    out.data[i + 1] = L
    out.data[i + 2] = L
    out.data[i + 3] = 255
  }
  return out
}

/** 透明像素按 alpha 与底色合成，避免 (0,0,0,0) 被当成黑块扰乱 jsQR */
/** @param {ImageData} id @param {number} bgR @param {number} bgG @param {number} bgB */
function flattenOntoSolid(id, bgR, bgG, bgB) {
  const out = new ImageData(id.width, id.height)
  for (let i = 0; i < id.data.length; i += 4) {
    const a = id.data[i + 3] / 255
    const ia = 1 - a
    out.data[i] = Math.min(255, Math.round(id.data[i] * a + bgR * ia))
    out.data[i + 1] = Math.min(255, Math.round(id.data[i + 1] * a + bgG * ia))
    out.data[i + 2] = Math.min(255, Math.round(id.data[i + 2] * a + bgB * ia))
    out.data[i + 3] = 255
  }
  return out
}

/** @param {ImageData} id */
function imageHasTransparency(id) {
  for (let i = 3; i < id.data.length; i += 4) {
    if (id.data[i] < 255) return true
  }
  return false
}

/** 直方图两端掐掉一定比例再线性拉伸，专治「浅灰底 + 略深模块」 */
/** @param {ImageData} id */
function percentileLuminanceStretch(id, lowQ, highQ) {
  const hist = new Uint32Array(256)
  for (let i = 0; i < id.data.length; i += 4) {
    hist[Math.min(255, Math.max(0, luminanceAt(id, i) | 0))]++
  }
  const n = id.width * id.height
  const lowTarget = Math.max(1, Math.floor(n * lowQ))
  const highTarget = Math.max(1, Math.ceil(n * (1 - highQ)))
  let cum = 0
  let lo = 0
  for (; lo < 256; lo++) {
    cum += hist[lo]
    if (cum >= lowTarget) break
  }
  cum = 0
  let hi = 255
  for (; hi > 0; hi--) {
    cum += hist[hi]
    if (cum >= highTarget) break
  }
  if (hi <= lo + 4) return grayscaleImageData(id)
  const range = hi - lo
  const out = cloneImageData(id)
  for (let i = 0; i < id.data.length; i += 4) {
    const L = luminanceAt(id, i)
    const v = Math.min(255, Math.max(0, Math.round(((L - lo) / range) * 255)))
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = 255
  }
  return out
}

/** 全局直方图均衡（灰度） */
/** @param {ImageData} id */
function equalizeGrayscale(id) {
  const hist = new Uint32Array(256)
  const n = id.width * id.height
  for (let i = 0; i < id.data.length; i += 4) {
    hist[Math.min(255, Math.max(0, luminanceAt(id, i) | 0))]++
  }
  const cdf = new Uint32Array(256)
  cdf[0] = hist[0]
  for (let i = 1; i < 256; i++) cdf[i] = cdf[i - 1] + hist[i]
  let lo = 0
  while (lo < 256 && hist[lo] === 0) lo++
  const cdfMin = lo === 0 ? 0 : cdf[lo - 1]
  const denom = Math.max(1, n - cdfMin)
  const lut = new Uint8Array(256)
  for (let v = 0; v < 256; v++) {
    lut[v] = Math.min(255, Math.round(((cdf[v] - cdfMin) / denom) * 255))
  }
  const out = cloneImageData(id)
  for (let i = 0; i < id.data.length; i += 4) {
    const L = luminanceAt(id, i) | 0
    const v = lut[L]
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = 255
  }
  return out
}

/** @param {ImageData} id */
function gammaGrayscale(id, gamma) {
  const inv = 1 / gamma
  const out = cloneImageData(id)
  for (let i = 0; i < id.data.length; i += 4) {
    const L = luminanceAt(id, i) / 255
    const v = Math.min(255, Math.max(0, Math.round(Math.pow(L, inv) * 255)))
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = 255
  }
  return out
}

/** Sauvola 局部阈值，适合光照不均、模块与底只差一点点的图 */
/** @param {ImageData} id */
function sauvolaBinary(id, halfWin, k, R) {
  const W = id.width
  const H = id.height
  const n = W * H
  const gray = new Float64Array(n)
  let gi = 0
  for (let i = 0; i < id.data.length; i += 4) {
    gray[gi++] = luminanceAt(id, i)
  }

  const Wp = W + 1
  const Hp = H + 1
  const intSum = new Float64Array(Wp * Hp)
  const intSq = new Float64Array(Wp * Hp)

  for (let y = 1; y <= H; y++) {
    for (let x = 1; x <= W; x++) {
      const g = gray[(y - 1) * W + (x - 1)]
      const idx = y * Wp + x
      const top = intSum[(y - 1) * Wp + x]
      const left = intSum[y * Wp + (x - 1)]
      const tl = intSum[(y - 1) * Wp + (x - 1)]
      intSum[idx] = g + top + left - tl
      const g2 = g * g
      intSq[idx] = g2 + intSq[(y - 1) * Wp + x] + intSq[y * Wp + (x - 1)] - intSq[(y - 1) * Wp + (x - 1)]
    }
  }

  const rectSum = (ii, x0, y0, x1, y1) => {
    const xa = x0
    const ya = y0
    const xb = x1 + 1
    const yb = y1 + 1
    return ii[yb * Wp + xb] - ii[ya * Wp + xb] - ii[yb * Wp + xa] + ii[ya * Wp + xa]
  }

  const out = new ImageData(W, H)
  const hw = halfWin

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const x0 = Math.max(0, x - hw)
      const y0 = Math.max(0, y - hw)
      const x1 = Math.min(W - 1, x + hw)
      const y1 = Math.min(H - 1, y + hw)
      const area = (x1 - x0 + 1) * (y1 - y0 + 1)
      const sum = rectSum(intSum, x0, y0, x1, y1)
      const sumSq = rectSum(intSq, x0, y0, x1, y1)
      const mean = sum / area
      const variance = Math.max(0, sumSq / area - mean * mean)
      const std = Math.sqrt(variance)
      const T = mean * (1 + k * (std / R - 1))
      const L = gray[y * W + x]
      const v = L <= T ? 0 : 255
      const o = (y * W + x) * 4
      out.data[o] = v
      out.data[o + 1] = v
      out.data[o + 2] = v
      out.data[o + 3] = 255
    }
  }
  return out
}

/** @param {ImageData} id */
function invertBinary(id) {
  const out = cloneImageData(id)
  for (let i = 0; i < id.data.length; i += 4) {
    const v = 255 - id.data[i]
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = 255
  }
  return out
}

/** 线性拉伸亮度，缓解褪色 / 对比度不足 */
/** @param {ImageData} id */
function luminanceStretch(id) {
  let minL = 255
  let maxL = 0
  for (let i = 0; i < id.data.length; i += 4) {
    const L = luminanceAt(id, i)
    if (L < minL) minL = L
    if (L > maxL) maxL = L
  }
  const range = maxL - minL
  const out = cloneImageData(id)
  if (range < 8) return grayscaleImageData(id)
  for (let i = 0; i < id.data.length; i += 4) {
    const L = luminanceAt(id, i)
    const v = Math.min(255, Math.max(0, Math.round(((L - minL) / range) * 255)))
    out.data[i] = v
    out.data[i + 1] = v
    out.data[i + 2] = v
    out.data[i + 3] = 255
  }
  return out
}

/** @param {CanvasImageSource} imgEl */
function sourceDimensions(imgEl) {
  if (imgEl instanceof HTMLImageElement) return { w: imgEl.naturalWidth, h: imgEl.naturalHeight }
  if (imgEl instanceof HTMLCanvasElement) return { w: imgEl.width, h: imgEl.height }
  if (typeof ImageBitmap !== 'undefined' && imgEl instanceof ImageBitmap)
    return { w: imgEl.width, h: imgEl.height }
  return { w: 0, h: 0 }
}

/** 粘贴整屏截图等超大图时，在原分辨率上做旋转 + Sauvola 会长时间阻塞主线程；先缩放到上限再解码 */
const MAX_DECODE_INPUT_SIDE = 2048

/**
 * @param {CanvasImageSource} imgEl
 * @returns {HTMLCanvasElement}
 */
function clampSourceToMaxSide(imgEl, maxSide) {
  const { w, h } = sourceDimensions(imgEl)
  const c = document.createElement('canvas')
  if (!w || !h) {
    c.width = c.height = 1
    const cx = c.getContext('2d')
    if (cx) cx.fillStyle = '#fff'
    cx?.fillRect(0, 0, 1, 1)
    return c
  }
  const scale = Math.min(1, maxSide / Math.max(w, h))
  const tw = Math.max(1, Math.round(w * scale))
  const th = Math.max(1, Math.round(h * scale))
  c.width = tw
  c.height = th
  const ctx = c.getContext('2d')
  if (!ctx) return c
  ctx.imageSmoothingEnabled = scale < 1
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, tw, th)
  ctx.drawImage(imgEl, 0, 0, tw, th)
  return c
}

/**
 * @param {CanvasImageSource} imgEl
 * @param {number} angleDeg
 */
function createRotatedCanvas(imgEl, angleDeg) {
  const { w, h } = sourceDimensions(imgEl)
  if (!w || !h) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    return c
  }
  const rad = (angleDeg * Math.PI) / 180
  const swap = angleDeg % 180 !== 0
  const cw = swap ? h : w
  const ch = swap ? w : h
  const c = document.createElement('canvas')
  c.width = Math.max(1, Math.round(cw))
  c.height = Math.max(1, Math.round(ch))
  const ctx = c.getContext('2d')
  if (!ctx) return c
  ctx.imageSmoothingEnabled = true
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.translate(c.width / 2, c.height / 2)
  ctx.rotate(rad)
  ctx.drawImage(imgEl, -w / 2, -h / 2)
  return c
}

/** @param {HTMLCanvasElement} canvas */
function getImageData(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

/**
 * @param {CanvasImageSource} drawable
 * @returns {HTMLCanvasElement[]}
 */
/**
 * @param {CanvasImageSource} drawable
 * @param {'fast' | 'full'} [mode]
 */
function buildDecodeCanvases(drawable, mode = 'full') {
  const { w, h } = sourceDimensions(drawable)
  if (!w || !h) return []

  const seen = new Set()
  /** @type {HTMLCanvasElement[]} */
  const list = []

  /** @param {number} tw @param {number} th @param {string} fillCss */
  const push = (tw, th, fillCss) => {
    const key = `${tw}x${th}|${fillCss}`
    if (seen.has(key)) return
    seen.add(key)
    const c = document.createElement('canvas')
    c.width = Math.max(1, tw | 0)
    c.height = Math.max(1, th | 0)
    const cx = c.getContext('2d')
    if (!cx) return
    cx.imageSmoothingEnabled = tw < w || th < h
    cx.fillStyle = fillCss
    cx.fillRect(0, 0, tw, th)
    cx.drawImage(drawable, 0, 0, tw, th)
    list.push(c)
  }

  /** @param {number} tw @param {number} th */
  const pushBothBg = (tw, th) => {
    push(tw, th, '#ffffff')
    push(tw, th, '#000000')
  }

  if (mode === 'fast') {
    /** 先用较小画布 + 轻量算法快速排除「根本不是二维码」的图（过大画布会让 jsQR 单次扫描很慢） */
    const maxSideFast = 720
    const scale = Math.min(1, maxSideFast / Math.max(w, h))
    const rw = Math.max(1, Math.round(w * scale))
    const rh = Math.max(1, Math.round(h * scale))
    pushBothBg(rw, rh)
    return list
  }

  /** 源已在 decode 入口按 MAX_DECODE_INPUT_SIDE 限制，此处再做一层上限避免 upscale 组合爆炸 */
  const maxSide = 1600
  if (Math.max(w, h) > maxSide) {
    const r = maxSide / Math.max(w, h)
    pushBothBg(Math.round(w * r), Math.round(h * r))
  } else {
    pushBothBg(w, h)
  }

  const minD = Math.min(w, h)
  const maxUpscaledSide = 2000
  for (const scale of [2, 3, 4]) {
    if (minD > 0 && Math.max(w, h) * scale <= maxUpscaledSide) {
      pushBothBg(Math.round(w * scale), Math.round(h * scale))
    }
  }

  return list
}

/**
 * @param {ImageData} id
 * @param {{ mode?: 'fast' | 'full'; isCancelled?: () => boolean }} [opts]
 */
function tryDecodePipeline(id, opts = {}) {
  const mode = opts.mode ?? 'full'
  const chk = opts.isCancelled

  const abort = () => Boolean(chk?.())

  let code = tryJsqr(id)
  if (code) return code
  if (abort()) return null

  code = tryJsqr(grayscaleImageData(id))
  if (code) return code
  if (abort()) return null

  code = tryJsqr(luminanceStretch(id))
  if (code) return code
  if (abort()) return null

  code = tryJsqr(percentileLuminanceStretch(id, 0.005, 0.995))
  if (code) return code
  code = tryJsqr(percentileLuminanceStretch(id, 0.02, 0.98))
  if (code) return code
  code = tryJsqr(percentileLuminanceStretch(id, 0.05, 0.95))
  if (code) return code

  if (mode === 'fast') return null

  if (abort()) return null
  code = tryJsqr(equalizeGrayscale(id))
  if (code) return code

  for (const g of [0.58, 0.72, 0.88, 1.12, 1.28, 1.48]) {
    if (abort()) return null
    code = tryJsqr(gammaGrayscale(id, g))
    if (code) return code
  }

  const mean = meanLuminance(id)
  const hist = histogramLuma(id)
  const ot = otsuThreshold(hist, id.width * id.height)

  for (const thr of [ot, mean, 128, 112, 144, 96, 160]) {
    for (const inv of [false, true]) {
      if (abort()) return null
      code = tryJsqr(thresholdToBinary(id, thr, inv))
      if (code) return code
    }
  }

  const px = id.width * id.height
  const sauvolaConfigs =
    px > 900000
      ? [{ hw: 10, k: 0.22, R: 128 }]
      : [
          { hw: 6, k: 0.12, R: 128 },
          { hw: 10, k: 0.22, R: 128 },
          { hw: 14, k: 0.32, R: 128 },
          { hw: 10, k: 0.22, R: 96 },
        ]

  const gray = grayscaleImageData(id)
  for (const { hw, k, R } of sauvolaConfigs) {
    for (const src of [id, gray]) {
      if (abort()) return null
      const bin = sauvolaBinary(src, hw, k, R)
      code = tryJsqr(bin)
      if (code) return code
      code = tryJsqr(invertBinary(bin))
      if (code) return code
    }
  }

  return null
}

/**
 * @param {ImageData} id
 * @param {{ mode?: 'fast' | 'full'; isCancelled?: () => boolean }} [opts]
 */
function tryVariantsOnImageData(id, opts = {}) {
  const mode = opts.mode ?? 'full'
  const isCancelled = opts.isCancelled

  /** @type {ImageData[]} */
  const bases = [id]
  if (imageHasTransparency(id)) {
    bases.push(flattenOntoSolid(id, 255, 255, 255))
    bases.push(flattenOntoSolid(id, 0, 0, 0))
  }

  for (const base of bases) {
    if (isCancelled?.()) return null
    const code = tryDecodePipeline(base, { mode, isCancelled })
    if (code) return code
  }
  return null
}

/** 先快后慢：无效图多数在前几阶段即可放弃，避免长时间跑 Sauvola */
const DECODE_PHASES = /** @type {const} */ ([
  ['fast', 'fast'],
  ['fast', 'full'],
  ['full', 'fast'],
  ['full', 'full'],
])

/**
 * @param {CanvasImageSource} imgEl
 * @returns {Generator<{ id: ImageData; pipeMode: 'fast' | 'full' }>}
 */
function* decodeStepGenerator(imgEl) {
  const src = clampSourceToMaxSide(imgEl, MAX_DECODE_INPUT_SIDE)
  /** @type {CanvasImageSource[]} */
  const variants = [src]
  for (const deg of [90, 180, 270]) {
    variants.push(createRotatedCanvas(src, deg))
  }

  for (const [canvasMode, pipeMode] of DECODE_PHASES) {
    for (const drawable of variants) {
      const canvases = buildDecodeCanvases(drawable, canvasMode)
      for (const canvas of canvases) {
        const id = getImageData(canvas)
        if (id) yield { id, pipeMode }
      }
    }
  }
}

/**
 * 对拍照/对比度差的二维码做多尺度 + 二值化 + 反色尝试，提高 jsQR 识别率。
 * @param {CanvasImageSource} imgEl
 */
export function decodeQrFromImage(imgEl) {
  for (const { id, pipeMode } of decodeStepGenerator(imgEl)) {
    const code = tryVariantsOnImageData(id, { mode: pipeMode })
    if (code) return code
  }
  return null
}

/**
 * 异步解码：阶段之间让出主线程，便于 UI 更新与取消。
 * @param {CanvasImageSource} imgEl
 * @param {{ isCancelled?: () => boolean; tick?: () => Promise<void> }} [opts]
 */
export async function decodeQrFromImageAsync(imgEl, opts = {}) {
  const isCancelled = opts.isCancelled ?? (() => false)
  const tick =
    opts.tick ??
    (async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

  for (const { id, pipeMode } of decodeStepGenerator(imgEl)) {
    if (isCancelled()) return null
    await tick()
    const code = tryVariantsOnImageData(id, { mode: pipeMode, isCancelled })
    if (code) return code
  }
  return null
}
