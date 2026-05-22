import QRCode from 'qrcode'

import {
  fileToDecodeSource,
  isProbablyDecodeableMediaFile,
  looksLikePasteableImageMarkup,
  textToDecodeSource,
} from './decodeInput.js'
import { decodeQrFromImageAsync } from './decodeQrRobust.js'

import {
  applyDocumentLang,
  escapeHtml,
  getLocaleMode,
  normalizeLocaleMode,
  setLocaleMode,
  t,
} from './i18n.js'

import {
  buildAboutPageInnerHtml,
  mountAboutPromoCards,
  syncAboutPromoPageLightIfMounted,
  teardownAboutPromoCards,
} from './about-promo.js'

/** @typedef {'png'|'jpg'|'svg'|'svg-code'} ExportFormat */
/** @typedef {'auto'|'dark'|'light'} ThemeMode */

const STORAGE_DEFAULT = {
  encodeText: '',
  fgHex: '#000000ff',
  bgHex: '#ffffffff',
  ecc: 'M',
  exportSize: '256',
  exportFormat: /** @type {ExportFormat} */ ('png'),
  themeMode: /** @type {ThemeMode} */ ('auto'),
  localeMode: /** @type {'auto'|'zh-CN'|'zh-TW'|'en'} */ ('auto'),
}

/** @type {ThemeMode} */
let themeMode = 'auto'

const COLORS = { card: '#242424' }

function qs(sel, root = document) {
  return root.querySelector(sel)
}

function getPromoStrings() {
  return {
    lookmyDemo: t('promo_lookmy_demo'),
    lookmySub: t('promo_lookmy_sub'),
    expo: [t('promo_expo_1'), t('promo_expo_2'), t('promo_expo_3')],
    showSub: t('promo_show_sub'),
    yono: [t('promo_yono_1'), t('promo_yono_2'), t('promo_yono_3')],
    orangeTitle: t('promo_orange_title'),
    orangeSub: t('promo_orange_sub'),
    listSep: t('promo_list_sep'),
  }
}

function applyShellI18n() {
  const tt = t('appTitle')
  const docTitle = qs('#app-doc-title')
  if (docTitle) docTitle.textContent = tt
  const h1 = qs('#app-title-heading')
  if (h1) h1.textContent = tt
  qs('#tabs-nav')?.setAttribute('aria-label', t('tabsAria'))

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (!key) return
    const attrOnly = el.getAttribute('data-i18n-attr')
    if (attrOnly) el.setAttribute(attrOnly, t(key))
    else el.textContent = t(key)
  })

  qs('#theme-strip')?.setAttribute('aria-label', t('theme_menu_aria'))
  qs('#lang-strip')?.setAttribute('aria-label', t('lang_menu_aria'))
}

function applyDecodeChromeI18n() {
  qs('#decode-drop')?.setAttribute('aria-label', t('decode_drop_aria'))
  const ht = qs('#decode-hit-title')
  const hs = qs('#decode-hit-sub')
  if (ht) ht.textContent = t('decode_hit_title')
  if (hs) hs.textContent = t('decode_hit_sub')
  const strip = qs('#decode-upload-compact')
  const lbl = qs('#decode-compact-label')
  const mode = strip?.dataset.compactMode
  const compactKeys = {
    busy: 'decode_busy_title',
    done: 'decode_compact_done',
    fail: 'decode_fail_short',
    imgbad: 'decode_image_bad',
  }
  if (lbl && strip && !strip.hidden && mode && compactKeys[mode]) {
    lbl.textContent = t(compactKeys[mode])
  }
  const slowHint = qs('#decode-slow-hint')
  if (slowHint && !slowHint.hidden) {
    slowHint.textContent = t('decode_slow_hint')
  }
  qs('#decode-qr-canvas')?.setAttribute('aria-label', t('decode_preview_aria'))
  qs('#current-qr-canvas')?.setAttribute('aria-label', t('current_qr_aria'))
  qs('#encode-preview-canvas')?.setAttribute('aria-label', t('encode_preview_aria'))
}

function applyEncodeStaticI18n() {
  const ecc = qs('#encode-ecc')
  if (ecc) {
    const titleKey = ecc.getAttribute('data-ecc-title-i18n')
    if (titleKey) ecc.title = t(titleKey)
    for (const val of /** @type {const} */ (['L', 'M', 'Q', 'H'])) {
      const opt = ecc.querySelector(`option[value="${val}"]`)
      if (!opt) continue
      opt.textContent = t(`ecc_${val}_label`)
      opt.title = t(`ecc_${val}_title`)
    }
  }
  qs('#split-menu')?.querySelectorAll('[data-format="svg-code"]').forEach(el => {
    el.textContent = t('menu_svg_code')
  })
}

function persistLocale() {
  chrome.storage.local.set({ localeMode: getLocaleMode() })
}

function syncLangUi() {
  const mode = getLocaleMode()
  const key =
    mode === 'zh-CN'
      ? 'lang_zhCN'
      : mode === 'zh-TW'
        ? 'lang_zhTW'
        : mode === 'en'
          ? 'lang_en'
          : 'lang_auto'
  const lbl = qs('#footer-lang-label')
  if (lbl) lbl.textContent = t(key)
  qs('#lang-strip')?.querySelectorAll('[data-locale-mode]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-locale-mode') === mode)
  })
}

function refreshAboutPageIfOpen() {
  const ap = qs('#about-page')
  const inner = qs('#about-page-body')
  if (!ap || ap.hidden || !inner) return
  teardownAboutPromoCards()
  inner.innerHTML = buildAboutPageInnerHtml()
  hydrateAboutPageAssets(inner)
  mountAboutPromoCards(inner, getPromoStrings())
  scheduleAboutOverlayScrollSync()
}

/** @type {{ refreshI18n: () => void } | null} */
let encodeI18nHook = null

function applyLocaleBundle() {
  applyDocumentLang()
  applyShellI18n()
  applyDecodeChromeI18n()
  applyEncodeStaticI18n()
  syncLangUi()
  syncThemeUi()
  renderCurrentPageQr()
  refreshAboutPageIfOpen()
  encodeI18nHook?.refreshI18n()
  document.dispatchEvent(new CustomEvent('addon-locale-change'))
}

function normalizeExportFormat(fmt) {
  const ok = ['png', 'jpg', 'svg', 'svg-code']
  return /** @type {ExportFormat} */ (ok.includes(fmt) ? fmt : 'png')
}

function normalizeThemeMode(m) {
  if (m === 'dark' || m === 'light' || m === 'auto') return m
  return 'auto'
}

function getEffectiveTheme() {
  if (themeMode === 'dark') return 'dark'
  if (themeMode === 'light') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', getEffectiveTheme())
  syncThemeUi()
  document.dispatchEvent(new CustomEvent('addon-theme-change'))
  renderCurrentPageQr()
  syncAboutPromoPageLightIfMounted()
}

function persistTheme() {
  chrome.storage.local.set({ themeMode })
}

function syncThemeUi() {
  qs('#theme-strip')
    ?.querySelectorAll('.theme-dd-item')
    .forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-mode') === themeMode)
    })
  const label = qs('#footer-theme-label')
  if (label) {
    const key =
      themeMode === 'dark' ? 'theme_dark' : themeMode === 'light' ? 'theme_light' : 'theme_auto'
    label.textContent = t(key)
  }
}

function hex6PickerToRgb(hex) {
  let h = (hex || '#000000').replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return { r, g, b }
}

function updateAlphaVisual(pickerEl, visualEl) {
  const { r, g, b } = hex6PickerToRgb(pickerEl.value)
  visualEl.style.backgroundImage = `linear-gradient(90deg, rgba(${r},${g},${b},0), rgba(${r},${g},${b},1))`
}

function getThemeQrModuleColors() {
  const st = getComputedStyle(document.documentElement)
  const ink = (st.getPropertyValue('--qr-ink').trim() || '#111111') + 'ff'
  const paper = (st.getPropertyValue('--qr-paper').trim() || '#ffffff') + 'ff'
  return { dark: ink, light: paper }
}

function getEmptyCanvasFill() {
  return getComputedStyle(document.documentElement).getPropertyValue('--empty-fill').trim() || COLORS.card
}

function parseCssColor(input) {
  const s = (input || '').trim()
  if (!s) throw new Error('')
  const hex8 = /^#([0-9a-fA-F]{8})$/.exec(s)
  if (hex8) {
    const h = hex8[1]
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    const a = parseInt(h.slice(6, 8), 16) / 255
    return { rgba: `rgba(${r},${g},${b},${a})`, hex8: '#' + h.toLowerCase() }
  }
  const hex6 = /^#([0-9a-fA-F]{6})$/.exec(s)
  if (hex6) {
    const h = hex6[1]
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return { rgba: `rgba(${r},${g},${b},1)`, hex8: '#' + h.toLowerCase() + 'ff' }
  }
  const hex4 = /^#([0-9a-fA-F]{4})$/.exec(s)
  if (hex4) {
    const h = hex4[1]
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    const a = parseInt(h[3] + h[3], 16) / 255
    return { rgba: `rgba(${r},${g},${b},${a})`, hex8: '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3] }
  }
  const hex3 = /^#([0-9a-fA-F]{3})$/.exec(s)
  if (hex3) {
    const h = hex3[1]
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    return { rgba: `rgba(${r},${g},${b},1)`, hex8: '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + 'ff' }
  }
  throw new Error('')
}

function tryParseColor(input) {
  try {
    const s = (input || '').trim()
    if (!s) return null
    return parseCssColor(s)
  } catch {
    return null
  }
}

function composeHex8(rrggbbPickerValue, alphaPct) {
  const hex = (rrggbbPickerValue || '#000000').replace('#', '').slice(0, 6)
  const rgb = hex.padEnd(6, '0').slice(0, 6).toLowerCase()
  const a = Math.max(0, Math.min(100, Number(alphaPct)))
  const byte = Math.round((a / 100) * 255)
  return '#' + rgb + byte.toString(16).padStart(2, '0')
}

function applyHex8ToPickers(hex8, picker, alphaRange) {
  const h = hex8.replace('#', '').padEnd(8, 'f').slice(0, 8)
  const rrggbb = '#' + h.slice(0, 6).toLowerCase()
  const alphaByte = parseInt(h.slice(6, 8), 16)
  if (!Number.isFinite(alphaByte)) return
  picker.value = rrggbb
  alphaRange.value = String(Math.round((alphaByte / 255) * 100))
}

/** 当前标签页地址只要能读到字符串即可生成二维码（含 edge://、chrome:// 等），不限定为 http */
function canEncodeTabUrl(url) {
  return typeof url === 'string' && url.trim().length > 0
}

async function getActiveTabUrl() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  const t = tabs[0]
  return { url: t?.url || '', title: t?.title || '' }
}

async function renderCurrentPageQr() {
  const canvas = qs('#current-qr-canvas')
  const fallback = qs('#current-qr-unavailable')
  const titleEl = qs('#current-qr-unavailable-title')
  const descEl = qs('#current-qr-unavailable-desc')
  if (!canvas || !fallback || !titleEl || !descEl) return

  const showFallback = (title, desc) => {
    canvas.hidden = true
    fallback.hidden = false
    titleEl.textContent = title
    descEl.textContent = desc
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const showQr = () => {
    canvas.hidden = false
    fallback.hidden = true
  }

  try {
    const { url } = await getActiveTabUrl()
    if (!canEncodeTabUrl(url)) {
      showFallback(t('current_unavailable_title'), t('current_unavailable_desc'))
      return
    }
    showQr()
    const { dark, light } = getThemeQrModuleColors()
    await QRCode.toCanvas(canvas, url, {
      width: 200,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark, light }
    })
  } catch {
    showFallback(t('current_fail_gen_title'), t('current_fail_gen_desc'))
  }
}

async function renderDecodedQrPreview(text) {
  const canvas = qs('#decode-qr-canvas')
  if (!canvas) return
  const { dark, light } = getThemeQrModuleColors()
  await QRCode.toCanvas(canvas, text, {
    width: 180,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark, light }
  })
}

function buildDecodeFailHtml() {
  return `
<div class="decode-result-card decode-result-fail">
  <div class="decode-result-head decode-result-head-solo">
    <span class="decode-result-label">${escapeHtml(t('decode_result_label'))}</span>
  </div>
  <div class="decode-result-body decode-result-fail-body">
    <span class="decode-fail-lead">${escapeHtml(t('decode_fail_lead'))}</span>
    <p class="decode-fail-note muted tiny">${escapeHtml(t('decode_fail_note'))}</p>
  </div>
</div>`.trim()
}

const DECODE_COPY_SRC_SVG =
  '<svg class="decode-copy-src-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="8.25" y="8.25" width="12.5" height="12.5" rx="2" stroke="currentColor" stroke-width="1.85"/><path d="M6 15.75V6.75c0-1.104.896-2 2-2h8.75" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/></svg>'

const DECODE_COPY_CHECK_SVG =
  '<svg class="decode-copy-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** 先让浏览器绘制「解析中」，再执行同步解码主线程任务 */
function yieldToPaint() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve(undefined))
    })
  })
}

function setupDecodeTab() {
  const drop = qs('#decode-drop')
  const input = qs('#decode-file')
  const previewWrap = qs('#decode-preview-wrap')
  const resultEl = qs('#decode-result')
  const uploadBadge = qs('#decode-upload-badge')
  const heroEl = qs('#decode-upload-hero')
  const compactStrip = qs('#decode-upload-compact')
  const compactLabel = qs('#decode-compact-label')
  const compactSpinner = qs('#decode-compact-spinner')
  const decodeCancelBtn = qs('#decode-cancel-btn')
  const filePickBtn = qs('#decode-file-trigger')
  const filePickBtnCompact = qs('#decode-file-trigger-compact')
  const copyDoneTimers = new WeakMap()
  const slowHintEl = qs('#decode-slow-hint')
  /** @type {number} */
  let decodeSlowHintTimer = 0

  function clearDecodeSlowHint() {
    if (decodeSlowHintTimer) {
      window.clearTimeout(decodeSlowHintTimer)
      decodeSlowHintTimer = 0
    }
    if (slowHintEl) {
      slowHintEl.hidden = true
      slowHintEl.textContent = ''
    }
  }

  /**
   * @param {number} myGen
   */
  function scheduleDecodeSlowHint(myGen) {
    if (decodeSlowHintTimer) {
      window.clearTimeout(decodeSlowHintTimer)
      decodeSlowHintTimer = 0
    }
    if (slowHintEl) {
      slowHintEl.hidden = true
      slowHintEl.textContent = ''
    }
    decodeSlowHintTimer = window.setTimeout(() => {
      decodeSlowHintTimer = 0
      if (myGen !== decodeGen) return
      if (!slowHintEl) return
      slowHintEl.textContent = t('decode_slow_hint')
      slowHintEl.hidden = false
    }, 3000)
  }

  /** @type {string | null} */
  let lastDecoded = null
  let decodeGen = 0

  function setCompactDataset(mode) {
    if (compactStrip) compactStrip.dataset.compactMode = mode
  }

  function showDecodeHero() {
    decodeGen++
    clearDecodeSlowHint()
    drop?.classList.remove('decode-upload--compact')
    if (heroEl) heroEl.hidden = false
    if (compactStrip) compactStrip.hidden = true
    if (uploadBadge) uploadBadge.hidden = false
    if (decodeCancelBtn) decodeCancelBtn.hidden = true
    if (compactSpinner) compactSpinner.hidden = true
    setCompactDataset('')
    if (compactLabel) compactLabel.textContent = ''
  }

  function showDecodeCompact() {
    drop?.classList.add('decode-upload--compact')
    if (heroEl) heroEl.hidden = true
    if (compactStrip) compactStrip.hidden = false
  }

  /**
   * @param {'busy' | 'done' | 'fail' | 'imgbad'} mode
   */
  function setCompactStripUi(mode) {
    const busy = mode === 'busy'
    if (decodeCancelBtn) decodeCancelBtn.hidden = !busy
    if (compactSpinner) compactSpinner.hidden = !busy
    setCompactDataset(mode)
    const keys = {
      busy: 'decode_busy_title',
      done: 'decode_compact_done',
      fail: 'decode_fail_short',
      imgbad: 'decode_image_bad',
    }
    if (compactLabel && keys[mode]) compactLabel.textContent = t(keys[mode])
  }

  document.addEventListener('addon-theme-change', () => {
    if (lastDecoded) renderDecodedQrPreview(lastDecoded).catch(() => {})
  })

  document.addEventListener('addon-locale-change', () => {
    applyDecodeChromeI18n()
    if (!lastDecoded && resultEl.querySelector('.decode-result-fail')) {
      resultEl.innerHTML = buildDecodeFailHtml()
    } else if (lastDecoded) {
      const label = resultEl.querySelector('.decode-result-label')
      if (label) label.textContent = t('decode_result_label')
      const btn = resultEl.querySelector('[data-action="decode-copy"]')
      if (btn) {
        const copyLbl = t('decode_copy')
        btn.setAttribute('title', copyLbl)
        btn.setAttribute('aria-label', btn.classList.contains('is-done') ? t('decode_copied') : copyLbl)
      }
    }
  })

  function isDecodePanelActive() {
    return Boolean(qs('#tab-decode')?.classList.contains('is-active'))
  }

  document.addEventListener(
    'paste',
    e => {
      if (!isDecodePanelActive()) return
      const cd = e.clipboardData
      if (!cd) return

      for (let i = 0; i < cd.items.length; i++) {
        const it = cd.items[i]
        if (it.kind === 'file') {
          const f = it.getAsFile()
          if (f && isProbablyDecodeableMediaFile(f)) {
            e.preventDefault()
            handleFile(f)
            return
          }
        }
      }

      const plain = cd.getData('text/plain')
      if (plain && looksLikePasteableImageMarkup(plain)) {
        e.preventDefault()
        beginDecodeSession(async () => {
          const src = await textToDecodeSource(plain)
          if (!src) throw new Error('paste-not-image-text')
          return src
        })
      }
    },
    true
  )

  drop.addEventListener('dragover', e => {
    e.preventDefault()
    drop.classList.add('drag')
  })
  drop.addEventListener('dragleave', () => drop.classList.remove('drag'))
  drop.addEventListener('drop', e => {
    e.preventDefault()
    drop.classList.remove('drag')
    const f = e.dataTransfer.files[0]
    if (isProbablyDecodeableMediaFile(f)) handleFile(f)
  })

  input.addEventListener('change', () => {
    const f = input.files?.[0]
    if (f) {
      handleFile(f)
      queueMicrotask(() => {
        input.value = ''
      })
    }
  })

  filePickBtn?.addEventListener('click', () => input.click())
  filePickBtnCompact?.addEventListener('click', () => input.click())

  decodeCancelBtn?.addEventListener('click', () => {
    previewWrap.hidden = true
    resultEl.innerHTML = ''
    lastDecoded = null
    showDecodeHero()
  })

  resultEl.addEventListener('click', async e => {
    const copyBtn = e.target.closest('[data-action="decode-copy"]')
    if (!copyBtn || !lastDecoded) return
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(lastDecoded)
      copyBtn.classList.add('is-done')
      copyBtn.setAttribute('aria-label', t('decode_copied'))
      clearTimeout(copyDoneTimers.get(copyBtn))
      copyDoneTimers.set(
        copyBtn,
        window.setTimeout(() => {
          copyBtn.classList.remove('is-done')
          copyBtn.setAttribute('aria-label', t('decode_copy'))
        }, 2200)
      )
    } catch {
      flashToast(t('toast_copy_fail'))
    }
  })

  function resetDecodeUi() {
    showDecodeHero()
    resultEl.innerHTML = ''
    previewWrap.hidden = true
    lastDecoded = null
  }

  /**
   * @param {() => Promise<CanvasImageSource>} loadSource
   */
  function beginDecodeSession(loadSource) {
    decodeGen++
    const myGen = decodeGen
    clearDecodeSlowHint()
    resultEl.innerHTML = ''
    showDecodeCompact()
    setCompactStripUi('busy')
    previewWrap.hidden = true
    lastDecoded = null
    scheduleDecodeSlowHint(myGen)

    ;(async () => {
      try {
        const source = await loadSource()
        if (myGen !== decodeGen) return
        setCompactStripUi('busy')
        await yieldToPaint()
        const code = await decodeQrFromImageAsync(source, {
          isCancelled: () => myGen !== decodeGen,
          tick: async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
          },
        })
        if (myGen !== decodeGen) return

        clearDecodeSlowHint()

        if (!code?.data) {
          previewWrap.hidden = true
          resultEl.innerHTML = buildDecodeFailHtml()
          setCompactStripUi('fail')
          return
        }

        const text = code.data
        lastDecoded = text
        const httpHref = sanitizeHttpUrl(text)

        setCompactStripUi('done')
        previewWrap.hidden = false
        renderDecodedQrPreview(text).catch(() => {})

        const safe = escapeHtml(text)
        const body = httpHref
          ? `<a class="decode-link" href="${escapeAttr(httpHref)}" target="_blank" rel="noopener noreferrer">${safe}</a>`
          : `<span class="decode-plain">${safe}</span>`
        resultEl.innerHTML = `
      <div class="decode-result-card">
        <div class="decode-result-head">
          <span class="decode-result-label">${escapeHtml(t('decode_result_label'))}</span>
          <button type="button" class="decode-copy-btn" data-action="decode-copy" title="${escapeHtml(t('decode_copy'))}" aria-label="${escapeHtml(t('decode_copy'))}">
            ${DECODE_COPY_SRC_SVG}
            ${DECODE_COPY_CHECK_SVG}
          </button>
        </div>
        <div class="decode-result-body">${body}</div>
      </div>`
      } catch {
        if (myGen !== decodeGen) return
        clearDecodeSlowHint()
        previewWrap.hidden = true
        resultEl.innerHTML = buildDecodeFailHtml()
        setCompactStripUi('imgbad')
      }
    })()
  }

  function handleFile(file) {
    if (!isProbablyDecodeableMediaFile(file)) return
    beginDecodeSession(() => fileToDecodeSource(file))
  }

  resetDecodeUi()
}

function positionSplitMenu(open) {
  const wrap = qs('#split-wrap')
  const menu = qs('#split-menu')
  if (!wrap || !menu) return
  if (!open) {
    menu.hidden = true
    return
  }
  menu.hidden = false
  requestAnimationFrame(() => {
    const rect = wrap.getBoundingClientRect()
    const h = menu.offsetHeight
    let top = rect.bottom + 6
    if (top + h > window.innerHeight - 8) top = Math.max(8, rect.top - h - 6)
    menu.style.top = `${top}px`
    menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 12))}px`
  })
}

/**
 * @param {typeof STORAGE_DEFAULT} saved
 */
function setupEncodeTab(saved) {
  const textInput = qs('#encode-text')
  const fgInput = qs('#encode-fg')
  const bgInput = qs('#encode-bg')
  const fgPicker = qs('#encode-fg-picker')
  const fgAlpha = qs('#encode-fg-alpha')
  const fgVis = qs('#encode-fg-alpha-visual')
  const bgPicker = qs('#encode-bg-picker')
  const bgAlpha = qs('#encode-bg-alpha')
  const bgVis = qs('#encode-bg-alpha-visual')
  const eccSelect = qs('#encode-ecc')
  const sizeSelect = qs('#encode-size')
  const canvas = qs('#tab-encode canvas.encode-preview')
  const splitBtn = qs('#split-download')
  const splitCaret = qs('#split-caret')
  const splitMenu = qs('#split-menu')

  /** @type {ExportFormat} */
  let exportFormat = normalizeExportFormat(saved.exportFormat)

  let syncingPickers = false
  let persistTimer = 0

  function persist(immediate = false) {
    const run = () => {
      chrome.storage.local.set({
        encodeText: textInput.value,
        fgHex: fgInput.value,
        bgHex: bgInput.value,
        ecc: eccSelect.value,
        exportSize: sizeSelect.value,
        exportFormat
      })
    }
    if (immediate) {
      clearTimeout(persistTimer)
      run()
      return
    }
    clearTimeout(persistTimer)
    persistTimer = window.setTimeout(run, 380)
  }

  function syncButtonLabel() {
    splitBtn.textContent =
      exportFormat === 'svg-code'
        ? t('copy_svg_code')
        : exportFormat === 'svg'
          ? t('dl_svg')
          : exportFormat === 'jpg'
            ? t('dl_jpg')
            : t('dl_png')
  }

  function closeMenu() {
    qs('#split-caret')?.setAttribute('aria-expanded', 'false')
    positionSplitMenu(false)
  }

  splitCaret.addEventListener('click', e => {
    e.stopPropagation()
    const open = splitMenu.hidden
    splitCaret.setAttribute('aria-expanded', String(open))
    positionSplitMenu(open)
  })

  splitMenu.addEventListener('click', e => e.stopPropagation())

  document.addEventListener('click', () => closeMenu())

  document.addEventListener('addon-theme-change', () => scheduleRedraw())

  splitMenu.querySelectorAll('[data-format]').forEach(el => {
    el.addEventListener('click', async e => {
      e.stopPropagation()
      const fmt = /** @type {ExportFormat} */ (el.getAttribute('data-format'))
      exportFormat = normalizeExportFormat(fmt)
      syncButtonLabel()
      persist(true)
      closeMenu()
      await exportQr(exportFormat)
    })
  })

  splitBtn.addEventListener('click', async e => {
    e.stopPropagation()
    await exportQr(exportFormat)
  })

  async function exportQr(fmt) {
    const text = textInput.value.trim()
    if (!text) {
      flashToast(t('toast_enter_content'))
      return
    }

    let fgParsed, bgParsed
    try {
      fgParsed = parseCssColor(fgInput.value.trim())
      bgParsed = parseCssColor(bgInput.value.trim())
    } catch {
      flashToast(t('toast_bad_color'))
      return
    }

    const ecc = eccSelect.value
    const w = Number(sizeSelect.value) || 256

    try {
      if (fmt === 'svg-code') {
        const svg = await QRCode.toString(text, {
          type: 'svg',
          width: w,
          margin: 2,
          errorCorrectionLevel: ecc,
          color: { dark: fgParsed.hex8, light: bgParsed.hex8 }
        })
        try {
          await navigator.clipboard.writeText(svg)
          flashToast(t('toast_copied'), true)
        } catch {
          flashToast(t('toast_copy_fail'))
        }
        return
      }

      if (fmt === 'svg') {
        const svg = await QRCode.toString(text, {
          type: 'svg',
          width: w,
          margin: 2,
          errorCorrectionLevel: ecc,
          color: { dark: fgParsed.hex8, light: bgParsed.hex8 }
        })
        downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), t('file_qr_svg'))
        return
      }

      const temp = document.createElement('canvas')
      await QRCode.toCanvas(temp, text, {
        width: w,
        margin: 2,
        errorCorrectionLevel: ecc,
        color: { dark: fgParsed.hex8, light: bgParsed.hex8 }
      })

      if (fmt === 'png') {
        temp.toBlob(b => {
          if (b) downloadBlob(b, t('file_qr_png'))
        }, 'image/png')
        return
      }

      if (fmt === 'jpg') {
        const flat = flattenAlphaToWhite(temp)
        flat.toBlob(b => {
          if (b) downloadBlob(b, t('file_qr_jpg'))
        }, 'image/jpeg', 0.92)
      }
    } catch {
      flashToast(t('toast_fail'))
    }
  }

  function pushFgFromPickers() {
    syncingPickers = true
    fgInput.value = composeHex8(fgPicker.value, Number(fgAlpha.value))
    syncingPickers = false
    updateAlphaVisual(fgPicker, fgVis)
    persist()
    scheduleRedraw()
  }

  function pushBgFromPickers() {
    syncingPickers = true
    bgInput.value = composeHex8(bgPicker.value, Number(bgAlpha.value))
    syncingPickers = false
    updateAlphaVisual(bgPicker, bgVis)
    persist()
    scheduleRedraw()
  }

  fgPicker.addEventListener('input', () => {
    if (!syncingPickers) pushFgFromPickers()
  })
  fgAlpha.addEventListener('input', () => {
    if (!syncingPickers) pushFgFromPickers()
  })
  bgPicker.addEventListener('input', () => {
    if (!syncingPickers) pushBgFromPickers()
  })
  bgAlpha.addEventListener('input', () => {
    if (!syncingPickers) pushBgFromPickers()
  })

  fgInput.addEventListener('input', () => {
    if (syncingPickers) return
    const p = tryParseColor(fgInput.value.trim())
    if (p) {
      syncingPickers = true
      applyHex8ToPickers(p.hex8, fgPicker, fgAlpha)
      syncingPickers = false
      updateAlphaVisual(fgPicker, fgVis)
    }
    persist()
    scheduleRedraw()
  })

  bgInput.addEventListener('input', () => {
    if (syncingPickers) return
    const p = tryParseColor(bgInput.value.trim())
    if (p) {
      syncingPickers = true
      applyHex8ToPickers(p.hex8, bgPicker, bgAlpha)
      syncingPickers = false
      updateAlphaVisual(bgPicker, bgVis)
    }
    persist()
    scheduleRedraw()
  })

  fgInput.addEventListener('blur', () => {
    const p = tryParseColor(fgInput.value.trim())
    if (p) {
      fgInput.value = p.hex8
      syncingPickers = true
      applyHex8ToPickers(p.hex8, fgPicker, fgAlpha)
      syncingPickers = false
      updateAlphaVisual(fgPicker, fgVis)
      persist(true)
      scheduleRedraw()
    }
  })

  bgInput.addEventListener('blur', () => {
    const p = tryParseColor(bgInput.value.trim())
    if (p) {
      bgInput.value = p.hex8
      syncingPickers = true
      applyHex8ToPickers(p.hex8, bgPicker, bgAlpha)
      syncingPickers = false
      updateAlphaVisual(bgPicker, bgVis)
      persist(true)
      scheduleRedraw()
    }
  })

  textInput.addEventListener('input', () => {
    persist()
    scheduleRedraw()
  })
  eccSelect.addEventListener('change', () => {
    persist(true)
    scheduleRedraw()
  })
  sizeSelect.addEventListener('change', () => {
    persist(true)
    scheduleRedraw()
  })

  let timer = 0
  function scheduleRedraw() {
    clearTimeout(timer)
    timer = window.setTimeout(() => redrawEncodePreview(), 80)
  }

  async function redrawEncodePreview() {
    const text = textInput.value.trim()
    const fgParsed = tryParseColor(fgInput.value.trim())
    const bgParsed = tryParseColor(bgInput.value.trim())
    const fill = getEmptyCanvasFill()

    if (!fgParsed || !bgParsed) {
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = fill
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      return
    }

    const ecc = eccSelect.value
    const w = Number(sizeSelect.value) || 256

    if (!text) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    try {
      await QRCode.toCanvas(canvas, text, {
        width: Math.min(w, 280),
        margin: 2,
        errorCorrectionLevel: ecc,
        color: {
          dark: fgParsed.hex8,
          light: bgParsed.hex8
        }
      })
    } catch {
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = fill
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  let fgVal = saved.fgHex || STORAGE_DEFAULT.fgHex
  let bgVal = saved.bgHex || STORAGE_DEFAULT.bgHex
  if (!tryParseColor(fgVal)) fgVal = STORAGE_DEFAULT.fgHex
  if (!tryParseColor(bgVal)) bgVal = STORAGE_DEFAULT.bgHex
  textInput.value = saved.encodeText || ''
  fgInput.value = fgVal
  bgInput.value = bgVal
  eccSelect.value = saved.ecc || STORAGE_DEFAULT.ecc
  sizeSelect.value = saved.exportSize || STORAGE_DEFAULT.exportSize

  const fgOk = tryParseColor(fgInput.value.trim())
  const bgOk = tryParseColor(bgInput.value.trim())
  syncingPickers = true
  applyHex8ToPickers((fgOk ?? tryParseColor(STORAGE_DEFAULT.fgHex)).hex8, fgPicker, fgAlpha)
  applyHex8ToPickers((bgOk ?? tryParseColor(STORAGE_DEFAULT.bgHex)).hex8, bgPicker, bgAlpha)
  syncingPickers = false
  updateAlphaVisual(fgPicker, fgVis)
  updateAlphaVisual(bgPicker, bgVis)

  syncButtonLabel()
  redrawEncodePreview()

  encodeI18nHook = {
    refreshI18n() {
      syncButtonLabel()
    }
  }

  return {
    prefill(text) {
      textInput.value = text
      persist(true)
      scheduleRedraw()
    },
    focusEncode() {
      textInput.focus()
      textInput.select()
    }
  }
}

function setupCurrentPageActions(goTab, encodeApi) {
  qs('#current-download').addEventListener('click', async () => {
    const { url } = await getActiveTabUrl()
    if (!canEncodeTabUrl(url)) {
      flashToast(t('toast_no_qr_current'))
      return
    }
    const c = document.createElement('canvas')
    try {
      const { dark, light } = getThemeQrModuleColors()
      await QRCode.toCanvas(c, url, {
        width: 512,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark, light }
      })
      c.toBlob(b => {
        if (b) downloadBlob(b, t('file_qr_png'))
      }, 'image/png')
    } catch {
      flashToast(t('toast_fail'))
    }
  })

  qs('#current-more-styles').addEventListener('click', async () => {
    const { url } = await getActiveTabUrl()
    if (!canEncodeTabUrl(url)) {
      flashToast(t('toast_no_qr_current'))
      return
    }
    goTab('encode')
    queueMicrotask(() => {
      encodeApi.prefill(url)
      requestAnimationFrame(() => encodeApi.focusEncode())
    })
  })
}

function flattenAlphaToWhite(srcCanvas) {
  const w = srcCanvas.width
  const h = srcCanvas.height
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const ctx = out.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(srcCanvas, 0, 0)
  return out
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a')
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const TOAST_CHECK_SVG =
  '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** @param {number} [durationMs] 毫秒；省略时成功提示偏短、其它略长 */
function flashToast(msg, success = false, durationMs) {
  let el = qs('#toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'toast'
    document.body.appendChild(el)
  }
  el.className = 'toast' + (success ? ' success' : '')
  if (success) {
    el.innerHTML = `${TOAST_CHECK_SVG}<span>${escapeHtml(msg)}</span>`
  } else {
    el.textContent = msg
  }
  el.hidden = false
  clearTimeout(flashToast._t)
  const ms = durationMs ?? (success ? 1000 : 1500)
  flashToast._t = window.setTimeout(() => {
    el.hidden = true
  }, ms)
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    flashToast(t('toast_copied'), true)
  } catch {
    flashToast(t('toast_copy_fail'))
  }
}

function escapeAttr(s) {
  return s.replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function sanitizeHttpUrl(raw) {
  const text = raw.trim()
  try {
    const u = new URL(text.startsWith('//') ? 'https:' + text : text)
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.href
  } catch {
    /* ignore */
  }
  return null
}

function setupTabs() {
  const buttons = Array.from(document.querySelectorAll('.tab-btn'))
  const panels = Array.from(document.querySelectorAll('.tab-panel'))
  const order = ['current', 'decode', 'encode']

  function activate(id) {
    const idx = order.indexOf(id)
    if (idx < 0) return

    panels.forEach((p, i) => {
      const on = i === idx
      p.classList.toggle('is-active', on)
      if (on) p.removeAttribute('inert')
      else p.setAttribute('inert', '')
      if (on) {
        p.classList.remove('is-entering')
        requestAnimationFrame(() => {
          p.classList.add('is-entering')
          window.setTimeout(() => p.classList.remove('is-entering'), 260)
        })
      }
    })

    buttons.forEach(b => {
      const on = b.dataset.tab === id
      b.classList.toggle('active', on)
      b.setAttribute('aria-selected', String(on))
    })

    if (id === 'current') renderCurrentPageQr()
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.tab))
  })

  activate('current')
  return activate
}

function setupFooterAndTheme() {
  const strip = qs('#theme-strip')
  const ft = qs('#footer-theme')
  const langStrip = qs('#lang-strip')
  const fl = qs('#footer-lang')

  function closeThemeStrip() {
    if (!strip || !ft) return
    strip.hidden = true
    ft.setAttribute('aria-expanded', 'false')
  }

  function closeLangStrip() {
    if (!langStrip || !fl) return
    langStrip.hidden = true
    fl.setAttribute('aria-expanded', 'false')
  }

  ft?.addEventListener('click', e => {
    e.stopPropagation()
    if (!strip || !ft) return
    const open = strip.hidden
    if (open) closeLangStrip()
    strip.hidden = !open
    ft.setAttribute('aria-expanded', String(!strip.hidden))
    syncThemeUi()
  })

  fl?.addEventListener('click', e => {
    e.stopPropagation()
    if (!langStrip || !fl) return
    const open = langStrip.hidden
    if (open) closeThemeStrip()
    langStrip.hidden = !open
    fl.setAttribute('aria-expanded', String(!langStrip.hidden))
    syncLangUi()
  })

  document.addEventListener('click', () => {
    closeThemeStrip()
    closeLangStrip()
  })
  strip?.addEventListener('click', e => e.stopPropagation())
  langStrip?.addEventListener('click', e => e.stopPropagation())

  strip?.querySelectorAll('.theme-dd-item').forEach(btn => {
    btn.addEventListener('click', () => {
      themeMode = normalizeThemeMode(btn.getAttribute('data-theme-mode'))
      persistTheme()
      applyTheme()
      closeThemeStrip()
    })
  })

  langStrip?.querySelectorAll('[data-locale-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const raw = btn.getAttribute('data-locale-mode')
      setLocaleMode(normalizeLocaleMode(raw))
      persistLocale()
      applyLocaleBundle()
      closeLangStrip()
    })
  })

  qs('#footer-about').addEventListener('click', () => openAboutModal())

  window.addEventListener('languagechange', () => {
    if (getLocaleMode() === 'auto') {
      applyLocaleBundle()
    }
  })

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (themeMode === 'auto') {
      applyTheme()
    }
  })
}

/** 关于页：仅在文档真实超出可视高度时允许 html 纵向滚动，避免出现假滚动条且滚轮无效 */
function syncAboutOverlayScroll() {
  const root = document.documentElement
  if (!root.classList.contains('about-overlay-open')) {
    root.classList.remove('about-doc-scroll')
    return
  }
  const slack = 4
  root.classList.toggle('about-doc-scroll', root.scrollHeight > root.clientHeight + slack)
}

function scheduleAboutOverlayScrollSync() {
  syncAboutOverlayScroll()
  requestAnimationFrame(() => {
    syncAboutOverlayScroll()
    requestAnimationFrame(syncAboutOverlayScroll)
  })
  setTimeout(syncAboutOverlayScroll, 60)
  setTimeout(syncAboutOverlayScroll, 260)
}

function closeAboutPage() {
  teardownAboutPromoCards()
  document.documentElement.classList.remove('about-overlay-open')
  document.documentElement.classList.remove('about-doc-scroll')
  document.body.classList.remove('about-overlay-open')
  const ap = qs('#about-page')
  if (ap) ap.hidden = true
  const inner = qs('#about-page-body')
  if (inner) inner.innerHTML = ''
}

function resolveExtensionUrl(path) {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      return chrome.runtime.getURL(path)
    }
  } catch {
    /* 非扩展上下文 */
  }
  return path
}

/** 关于页静态资源改为扩展内本地路径，避免在线拉取 logo / 联系二维码 */
function hydrateAboutPageAssets(inner) {
  const logo = inner.querySelector('[data-about-logo]')
  if (logo) logo.src = resolveExtensionUrl('icons/icon128.png')

  const pairs = [
    ['[data-about-wx-light]', 'extension-assets/wx-white.svg'],
    ['[data-about-wx-dark]', 'extension-assets/wx-gray.svg'],
    ['[data-about-qywx-light]', 'extension-assets/qywx-white.svg'],
    ['[data-about-qywx-dark]', 'extension-assets/qywx-gray.svg'],
  ]
  for (const [sel, file] of pairs) {
    const el = inner.querySelector(sel)
    if (el) el.src = resolveExtensionUrl(file)
  }
}

function openAboutModal() {
  const strip = qs('#theme-strip')
  const ft = qs('#footer-theme')
  const langStrip = qs('#lang-strip')
  const fl = qs('#footer-lang')
  if (strip && !strip.hidden) {
    strip.hidden = true
    ft?.setAttribute('aria-expanded', 'false')
  }
  if (langStrip && !langStrip.hidden) {
    langStrip.hidden = true
    fl?.setAttribute('aria-expanded', 'false')
  }

  const lb = qs('#modal-lightbox')
  if (lb && !lb.hidden) closeModal()

  teardownAboutPromoCards()
  const inner = qs('#about-page-body')
  if (!inner) return
  inner.innerHTML = buildAboutPageInnerHtml()
  hydrateAboutPageAssets(inner)

  document.documentElement.classList.add('about-overlay-open')
  document.body.classList.add('about-overlay-open')
  const ap = qs('#about-page')
  if (ap) ap.hidden = false

  queueMicrotask(() => {
    mountAboutPromoCards(inner, getPromoStrings())
    scheduleAboutOverlayScrollSync()
  })
}

function openModal(title, body, opts = {}) {
  closeAboutPage()

  const strip = qs('#theme-strip')
  const ft = qs('#footer-theme')
  const langStrip = qs('#lang-strip')
  const fl = qs('#footer-lang')
  if (strip && !strip.hidden) {
    strip.hidden = true
    ft?.setAttribute('aria-expanded', 'false')
  }
  if (langStrip && !langStrip.hidden) {
    langStrip.hidden = true
    fl?.setAttribute('aria-expanded', 'false')
  }

  qs('#modal-card')?.classList.remove('modal-card--about')

  qs('#modal-title').textContent = title
  const bodyEl = qs('#modal-body')
  bodyEl.className = opts.rich ? 'modal-body modal-about-rich' : 'modal-body'
  if (opts.html) {
    bodyEl.innerHTML = body
  } else {
    bodyEl.textContent = body
  }
  qs('#modal-lightbox').hidden = false
}

function closeModal() {
  teardownAboutPromoCards()
  qs('#modal-card')?.classList.remove('modal-card--about')
  qs('#modal-lightbox').hidden = true
}

document.addEventListener('DOMContentLoaded', async () => {
  let merged = { ...STORAGE_DEFAULT }
  try {
    merged = { ...STORAGE_DEFAULT, ...(await chrome.storage.local.get(STORAGE_DEFAULT)) }
  } catch {
    /* 非扩展环境或 storage 不可用时仍要能打开界面 */
  }

  setLocaleMode(normalizeLocaleMode(merged.localeMode))
  themeMode = normalizeThemeMode(merged.themeMode)
  applyTheme()

  try {
    setupFooterAndTheme()
    qs('#modal-close').addEventListener('click', closeModal)
    qs('#modal-lightbox').addEventListener('click', e => {
      if (e.target === qs('#modal-lightbox')) closeModal()
    })
    qs('#about-page-back').addEventListener('click', () => closeAboutPage())

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return
      const ap = qs('#about-page')
      if (ap && !ap.hidden) {
        closeAboutPage()
        return
      }
      const lb = qs('#modal-lightbox')
      if (lb && !lb.hidden) {
        closeModal()
        return
      }
      const strip = qs('#theme-strip')
      const ft = qs('#footer-theme')
      const langStrip = qs('#lang-strip')
      const fl = qs('#footer-lang')
      if (strip && !strip.hidden) {
        strip.hidden = true
        ft?.setAttribute('aria-expanded', 'false')
      }
      if (langStrip && !langStrip.hidden) {
        langStrip.hidden = true
        fl?.setAttribute('aria-expanded', 'false')
      }
    })

    const goTab = setupTabs()
    setupDecodeTab()
    const encodeApi = setupEncodeTab(merged)
    setupCurrentPageActions(goTab, encodeApi)
    applyLocaleBundle()

    window.addEventListener('resize', () => {
      if (document.documentElement.classList.contains('about-overlay-open')) {
        syncAboutOverlayScroll()
      }
    })
  } catch (err) {
    console.error('[addon-qrcode]', err)
  }
})
