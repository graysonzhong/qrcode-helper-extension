import UTIF from 'utif'

/** @type {RegExp} */
const EXT_MEDIA =
  /\.(png|jpe?g|gif|webp|bmp|svg|ico|avif|tiff?|hei[cf]|mov|mp4|webm|m4v)$/i

const MAX_CLIPBOARD_TEXT_FOR_IMAGE = 1_800_000

/**
 * @param {File | null | undefined} file
 */
export function isProbablyDecodeableMediaFile(file) {
  if (!file) return false
  const t = file.type || ''
  if (t.startsWith('image/')) return true
  if (t.startsWith('video/')) return true
  return EXT_MEDIA.test(file.name || '')
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(/** @type {string} */ (r.result))
    r.onerror = () => reject(r.error ?? new Error('read'))
    r.readAsDataURL(file)
  })
}

/**
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('img'))
    img.src = src
  })
}

/**
 * @param {ArrayBuffer} buffer
 * @returns {HTMLCanvasElement}
 */
function tiffBufferToCanvas(buffer) {
  const ifds = UTIF.decode(buffer)
  if (!ifds?.length) throw new Error('tiff')

  let bestIfd = null
  let bestArea = 0

  for (let i = 0; i < ifds.length; i++) {
    const ifd = ifds[i]
    UTIF.decodeImage(buffer, ifd)
    const area = (ifd.width | 0) * (ifd.height | 0)
    if (area > bestArea) {
      bestArea = area
      bestIfd = ifd
    }
  }

  if (!bestIfd?.width || !bestIfd.height || !bestArea) throw new Error('tiff-empty')

  const rgba = UTIF.toRGBA8(bestIfd)
  const w = bestIfd.width
  const h = bestIfd.height

  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('tiff-ctx')
  ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), w, h), 0, 0)
  return c
}

/**
 * @param {File} file
 * @returns {Promise<HTMLCanvasElement>}
 */
async function videoFileFirstFrameCanvas(file) {
  const url = URL.createObjectURL(file)
  try {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.src = url

    await new Promise((resolve, reject) => {
      const t = window.setTimeout(() => reject(new Error('video-timeout')), 20000)
      video.onloadeddata = () => {
        window.clearTimeout(t)
        resolve(undefined)
      }
      video.onerror = () => {
        window.clearTimeout(t)
        reject(new Error('video-load'))
      }
    })

    const tDur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 1
    video.currentTime = Math.min(0.08, tDur * 0.02)

    await new Promise((resolve, reject) => {
      const t = window.setTimeout(() => reject(new Error('video-seek-timeout')), 10000)
      video.onseeked = () => {
        window.clearTimeout(t)
        resolve(undefined)
      }
      video.onerror = () => {
        window.clearTimeout(t)
        reject(new Error('video-seek'))
      }
    })

    const vw = video.videoWidth
    const vh = video.videoHeight
    if (!vw || !vh) throw new Error('video-size')

    const c = document.createElement('canvas')
    c.width = vw
    c.height = vh
    const cx = c.getContext('2d')
    if (!cx) throw new Error('video-ctx')
    cx.drawImage(video, 0, 0)
    video.removeAttribute('src')
    video.load()
    return c
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * 将常见图片 / 视频（首帧）/ TIFF 等转为可在解码管线中使用的 {@link CanvasImageSource}。
 * @param {File} file
 * @returns {Promise<CanvasImageSource>}
 */
export async function fileToDecodeSource(file) {
  const name = file.name || ''
  const type = file.type || ''

  if (type.startsWith('video/') || /\.(mov|mp4|webm|m4v)$/i.test(name)) {
    return videoFileFirstFrameCanvas(file)
  }

  if (/\.tiff?$/i.test(name) || type === 'image/tiff') {
    const buf = await file.arrayBuffer()
    return tiffBufferToCanvas(buf)
  }

  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file)
      const c = document.createElement('canvas')
      c.width = bmp.width
      c.height = bmp.height
      const cx = c.getContext('2d')
      if (cx) {
        cx.fillStyle = '#ffffff'
        cx.fillRect(0, 0, c.width, c.height)
        cx.drawImage(bmp, 0, 0)
      }
      bmp.close?.()
      return c
    } catch {
      /* HEIC 等在部分系统上 createImageBitmap 不可用，退回 <img> */
    }
  }

  const dataUrl = await readFileAsDataURL(file)
  return loadImageElement(dataUrl)
}

/**
 * @param {string} raw
 */
export function looksLikePasteableImageMarkup(raw) {
  const text = raw.trim()
  if (!text || text.length < 12 || text.length > MAX_CLIPBOARD_TEXT_FOR_IMAGE) return false
  if (/^data:image\//i.test(text)) return true
  if (/^<\?xml/i.test(text) && /<svg[\s>/]/i.test(text)) return true
  return /<svg[\s>/]/i.test(text)
}

/**
 * 从粘贴的 SVG 源码或 data:image… URL 得到解码用图源。
 * @param {string} raw
 * @returns {Promise<CanvasImageSource | null>}
 */
export async function textToDecodeSource(raw) {
  const text = raw.trim()
  if (!looksLikePasteableImageMarkup(text)) return null

  if (/^data:image\//i.test(text)) {
    return loadImageElement(text)
  }

  const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  try {
    return await loadImageElement(url)
  } finally {
    URL.revokeObjectURL(url)
  }
}
