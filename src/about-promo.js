// 关于页推广区（Canvas）

import { escapeHtml, t } from './i18n.js'

const PROMO_LOOKMY_URL = 'https://lookmy.net'
const PROMO_SHOW_URL = 'https://lookmy.show'
const PROMO_YONOVELTY_URL = 'https://www.yonovelty.com'

export const CONTACT_PHONE = '19146466617'
export const CONTACT_EMAIL = 'zgs@yonovelty.com'
export const CONTACT_WEB = 'https://www.yonovelty.com/'

/** @type {null | (() => void)} */
let aboutPromoUnmount = null

export function buildAboutPageInnerHtml() {
  const esc = escapeHtml
  const logoAlt = esc(t('about_logo_alt'))
  const phone = esc(CONTACT_PHONE)
  const email = esc(CONTACT_EMAIL)
  const webSafe = esc(CONTACT_WEB)
  const webHref = esc(CONTACT_WEB)
  return `
<div class="modal-about-static">
  <div class="about-static-brand about-static-brand--enter">
    <img class="about-static-logo" src="" width="56" height="56" alt="${logoAlt}" data-about-logo />
  </div>
  <div class="about-section-block">
    <div class="about-section-title">${esc(t('about_product_title'))}</div>
    ${t('about_product_html')}
    <div class="about-section-rule" aria-hidden="true"></div>
  </div>
  <div class="about-section-block">
    <div class="about-section-title">${esc(t('about_company_title'))}</div>
    <p class="about-section-body">${esc(t('about_company_body'))}</p>
    <div class="about-section-rule" aria-hidden="true"></div>
  </div>
  <dl class="about-contact-meta about-contact-meta--inline" aria-label="${esc(t('contact_section_aria'))}">
    <div class="about-contact-meta-row"><dt>${esc(t('contact_phone_label'))}</dt><dd>${phone}</dd></div>
    <div class="about-contact-meta-row"><dt>${esc(t('contact_email_label'))}</dt><dd><a class="about-contact-link" href="mailto:${email}">${email}</a></dd></div>
    <div class="about-contact-meta-row"><dt>${esc(t('contact_web_label'))}</dt><dd><a class="about-contact-link" href="${webHref}" target="_blank" rel="noopener noreferrer">${webSafe}</a></dd></div>
    <div class="about-contact-meta-row about-contact-meta-row--addr"><dt>${esc(t('contact_address_label'))}</dt><dd class="about-contact-address">${esc(t('contact_address_value'))}</dd></div>
  </dl>
  <div class="about-static-contact" aria-label="${esc(t('contact_section_aria'))}">
    <div class="about-contact-row">
      <div class="about-contact-cell">
        <div class="about-contact-qr-wrap">
          <img class="about-contact-qr about-qr--light" src="" width="88" height="88" alt="${esc(t('contact_wechat_alt'))}" data-about-wx-light />
          <img class="about-contact-qr about-qr--dark" src="" width="88" height="88" alt="${esc(t('contact_wechat_alt'))}" data-about-wx-dark />
        </div>
        <span class="about-contact-caption">${esc(t('contact_wechat_caption'))}</span>
      </div>
      <div class="about-contact-cell">
        <div class="about-contact-qr-wrap">
          <img class="about-contact-qr about-qr--light" src="" width="88" height="88" alt="${esc(t('contact_qywx_alt'))}" data-about-qywx-light />
          <img class="about-contact-qr about-qr--dark" src="" width="88" height="88" alt="${esc(t('contact_qywx_alt'))}" data-about-qywx-dark />
        </div>
        <span class="about-contact-caption">${esc(t('contact_qywx_caption'))}</span>
      </div>
    </div>
  </div>
  <div class="about-static-products">
    <div class="about-section-title about-static-products-title">${esc(t('about_other_products_title'))}</div>
    <div class="about-section-rule" aria-hidden="true"></div>
    <div class="promo-cards-root">
      <div class="promo-row">
        <a class="promo-card promo-lookmy" href="${PROMO_LOOKMY_URL}" target="_blank" rel="noopener noreferrer">
          <canvas data-promo-canvas="lookmy" class="promo-canvas"></canvas>
          <div class="promo-overlay promo-overlay-matrix" data-phase="0">
            <svg class="promo-icon-monitor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"></rect>
              <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
            <span class="promo-typing-text"><span id="promo-lookmy-typed"></span><span id="promo-lookmy-cursor" class="promo-cursor">|</span></span>
          </div>
          <div class="promo-overlay promo-overlay-blue" data-phase="1">
            <span class="promo-blue-title">LOOKMY.NET</span>
            <span class="promo-blue-sub">网络检查小助手</span>
          </div>
          <div class="promo-shine"></div>
        </a>
        <a class="promo-card promo-expo" href="${PROMO_SHOW_URL}" target="_blank" rel="noopener noreferrer">
          <canvas data-promo-canvas="expo" class="promo-canvas"></canvas>
          <div class="promo-overlay promo-overlay-expo" data-phase="0">
            <div class="promo-expo-wavy">
              <span data-expo-seg-index="0"><span class="promo-expo-word">展会</span><span class="promo-expo-sep">、</span></span>
              <span data-expo-seg-index="1"><span class="promo-expo-word">日历</span><span class="promo-expo-sep">、</span></span>
              <span data-expo-seg-index="2"><span class="promo-expo-word">销售</span></span>
            </div>
          </div>
          <div class="promo-overlay promo-overlay-lookmy-show" data-phase="1">
            <span class="promo-lookmy-show-title">LOOKMY.SHOW</span>
            <span class="promo-lookmy-show-sub">全国展会查询</span>
          </div>
          <div class="promo-shine"></div>
        </a>
        <a class="promo-card promo-yonovelty" href="${PROMO_YONOVELTY_URL}" target="_blank" rel="noopener noreferrer">
          <canvas data-promo-canvas="yono" class="promo-canvas"></canvas>
          <div class="promo-overlay promo-overlay-stars" data-phase="0">
            <div class="promo-star-text">
              <span data-yono-seg-index="0"><span class="promo-star-segment promo-pop-in">私有CRM</span><span class="promo-sep">、</span></span>
              <span data-yono-seg-index="1"><span class="promo-star-segment promo-pop-in">信创CMS</span><span class="promo-sep">、</span></span>
              <span data-yono-seg-index="2"><span class="promo-star-segment promo-pop-in">AI落地</span></span>
            </div>
          </div>
          <div class="promo-overlay promo-overlay-orange" data-phase="1">
            <span class="promo-orange-title">软件定制</span>
            <span class="promo-orange-sub">深度集成和IT服务</span>
          </div>
          <div class="promo-shine"></div>
        </a>
      </div>
    </div>
  </div>
</div>
`.trim()
}

function aboutPromoThemeIsDark() {
  const h = document.documentElement
  return h.getAttribute('data-theme') === 'dark' || h.classList.contains('dark')
}

export function syncAboutPromoPageLightIfMounted() {
  const root = document.querySelector('.modal-about-host-wrap .promo-cards-root')
  if (root) root.classList.toggle('promo-page-light', !aboutPromoThemeIsDark())
}

export function teardownAboutPromoCards() {
  if (aboutPromoUnmount) {
    aboutPromoUnmount()
    aboutPromoUnmount = null
  }
}

export function mountAboutPromoCards(bodyEl, promoStrings) {
  teardownAboutPromoCards()
  const root = bodyEl.querySelector('.promo-cards-root')
  if (!root) return

  const lookmyDemoFull = promoStrings?.lookmyDemo ?? t('promo_lookmy_demo')

  if (promoStrings) {
    const blueSub = root.querySelector('.promo-blue-sub')
    if (blueSub) blueSub.textContent = promoStrings.lookmySub
    const expoWords = root.querySelectorAll('.promo-expo-word')
    promoStrings.expo.forEach((txt, i) => {
      const el = expoWords[i]
      if (el) el.textContent = txt
    })
    root.querySelectorAll('.promo-expo-sep').forEach(el => {
      el.textContent = promoStrings.listSep
    })
    const showSub = root.querySelector('.promo-lookmy-show-sub')
    if (showSub) showSub.textContent = promoStrings.showSub
    const yonoWords = root.querySelectorAll('.promo-star-segment')
    promoStrings.yono.forEach((txt, i) => {
      const el = yonoWords[i]
      if (el) el.textContent = txt
    })
    root.querySelectorAll('.promo-star-text .promo-sep').forEach(el => {
      el.textContent = promoStrings.listSep
    })
    const ot = root.querySelector('.promo-orange-title')
    const os = root.querySelector('.promo-orange-sub')
    if (ot) ot.textContent = promoStrings.orangeTitle
    if (os) os.textContent = promoStrings.orangeSub
  }
  /** @type {ReturnType<typeof setTimeout> | null} */
  let phaseTimer = null
  /** @type {ReturnType<typeof setInterval> | null} */
  let typingTimer = null
  /** @type {ReturnType<typeof setTimeout> | null} */
  let yonoTimer1 = null
  /** @type {ReturnType<typeof setTimeout> | null} */
  let yonoTimer2 = null
  /** @type {ReturnType<typeof setTimeout> | null} */
  let expoTimer1 = null
  /** @type {ReturnType<typeof setTimeout> | null} */
  let expoTimer2 = null

  /** @type {{ stop(): void } | null} */
  let matrixHandle = null
  /** @type {{ stop(): void } | null} */
  let squareHandle = null
  /** @type {{ stop(): void } | null} */
  let starfieldHandle = null

  root.classList.toggle('promo-page-light', !aboutPromoThemeIsDark())

  function onAddonThemeChange() {
    root.classList.toggle('promo-page-light', !aboutPromoThemeIsDark())
  }
  document.addEventListener('addon-theme-change', onAddonThemeChange)

  const overlays = [...root.querySelectorAll('.promo-overlay[data-phase]')]
  /** @type {HTMLElement | null} */
  const typedEl = root.querySelector('#promo-lookmy-typed')
  /** @type {HTMLElement | null} */
  const cursorEl = root.querySelector('#promo-lookmy-cursor')
  const expoSegEls = [...root.querySelectorAll('[data-expo-seg-index]')]
  const yonoSegEls = [...root.querySelectorAll('[data-yono-seg-index]')]

  function setPhase(ph) {
    overlays.forEach(el => el.classList.toggle('promo-phase-active', Number(el.dataset.phase) === ph))
  }

  function syncExpoSegments(expoIdx) {
    expoSegEls.forEach(el => {
      const i = Number(el.dataset.expoSegIndex)
      el.classList.toggle('promo-seg-hide', expoIdx < i)
    })
  }

  function syncYonoSegments(yonoIdx) {
    yonoSegEls.forEach(el => {
      const i = Number(el.dataset.yonoSegIndex)
      el.classList.toggle('promo-seg-hide', yonoIdx < i)
    })
  }

  function startIpTyping() {
    if (!typedEl) return
    typedEl.textContent = ''
    if (cursorEl) cursorEl.hidden = false
    let i = 0
    if (typingTimer) clearInterval(typingTimer)
    typingTimer = setInterval(() => {
      i += 1
      typedEl.textContent = lookmyDemoFull.slice(0, i)
      if (i >= lookmyDemoFull.length) {
        clearInterval(typingTimer)
        typingTimer = null
        if (cursorEl) cursorEl.hidden = true
      }
    }, 70)
  }

  /** @returns {{ stop(): void }} */
  function initDotMatrix(canvas) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return { stop: () => {} }
    const DIGITS = '0123456789'
    /** @type {number | null} */
    let rafId = null
    let dots = /** @type {{ y: number; speed: number; char: string }[] | null} */ (null)
    const DOT_GAP = 14
    const DOT_R = 1.2
    const CARD_MIN_HEIGHT = 48
    let cols = 0
    let rowCount = 0
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const w = Math.max(1, rect.width)
      const h = Math.max(CARD_MIN_HEIGHT, rect.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / DOT_GAP) + 1
      rowCount = Math.ceil(h / DOT_GAP) + 1
      if (!dots || dots.length !== cols) {
        dots = Array.from({ length: cols }, () => ({
          y: Math.random() * -rowCount,
          speed: 0.15 + Math.random() * 0.25,
          char: DIGITS[Math.floor(Math.random() * DIGITS.length)],
        }))
      }
    }

    resize()
    const draw = () => {
      const dark = aboutPromoThemeIsDark()
      const dpr = window.devicePixelRatio || 1
      const lw = canvas.width / dpr
      const lh = canvas.height / dpr
      ctx.fillStyle = dark ? 'rgba(0, 0, 0, 0.14)' : 'rgba(204, 224, 245, 0.2)'
      ctx.fillRect(0, 0, lw, lh)
      if (!dots) return
      for (let c = 0; c < cols; c += 1) {
        const dot = dots[c]
        const x = c * DOT_GAP
        const headY = dot.y * DOT_GAP
        for (let r = 0; r < rowCount; r += 1) {
          const ry = r * DOT_GAP
          const dist = headY - ry
          if (dist < 0 || dist > DOT_GAP * 6) continue
          const alpha = Math.max(0, 1 - dist / (DOT_GAP * 6))
          const brightness = dark ? 100 + Math.floor(alpha * 155) : 40 + Math.floor(alpha * 80)
          const green = dark ? 50 : 120
          ctx.fillStyle = `rgba(0, ${brightness}, ${green}, ${alpha * (dark ? 0.28 : 0.5)})`
          ctx.beginPath()
          ctx.arc(x, ry, DOT_R + alpha * 0.8, 0, Math.PI * 2)
          ctx.fill()
        }
        if (Math.random() < 0.02) {
          const brightness = dark ? 140 + Math.floor(Math.random() * 115) : 60 + Math.floor(Math.random() * 80)
          const green = dark ? 50 : 120
          ctx.fillStyle = `rgba(0, ${brightness}, ${green}, ${dark ? 0.16 : 0.4})`
          ctx.font = '9px monospace'
          ctx.fillText(DIGITS[Math.floor(Math.random() * DIGITS.length)], x - 3, headY)
        }
        dot.y += dot.speed
        if (dot.y * DOT_GAP > lh + DOT_GAP * 4) {
          dot.y = Math.random() * -6
          dot.speed = 0.15 + Math.random() * 0.25
        }
      }
      rafId = requestAnimationFrame(draw)
    }
    draw()

    /** @type {ResizeObserver | null} */
    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      const p = canvas.parentElement
      if (p) ro.observe(p)
    }

    return {
      stop: () => {
        if (rafId != null) cancelAnimationFrame(rafId)
        if (ro) ro.disconnect()
      },
    }
  }

  /** @returns {{ stop(): void }} */
  function initStarfield(canvas) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return { stop: () => {} }
    /** @type {number | null} */
    let rafId = null
    let stars = /** @type {{ x: number; y: number; r: number; phase: number; speed: number }[]} */ (
      []
    )
    let w = 1
    let h = 1
    const CARD_MIN_HEIGHT = 48

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(CARD_MIN_HEIGHT, rect.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.floor((w * h) / 180)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.08 + Math.random() * 0.14,
      }))
    }

    resize()
    const draw = () => {
      const dark = aboutPromoThemeIsDark()
      ctx.fillStyle = dark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 224, 194, 0.25)'
      ctx.fillRect(0, 0, w, h)
      stars.forEach(s => {
        s.phase += s.speed
        const t = 0.5 + 0.5 * Math.sin(s.phase)
        const twinkle = 0.06 + 0.94 * t
        const alpha = twinkle * (dark ? 0.9 : 0.5)
        const radius = s.r * (0.7 + 0.4 * t)
        ctx.fillStyle = dark ? `rgba(255, 255, 255, ${alpha})` : `rgba(180, 100, 40, ${alpha})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2)
        ctx.fill()
      })
      rafId = requestAnimationFrame(draw)
    }
    draw()

    /** @type {ResizeObserver | null} */
    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      const p = canvas.parentElement
      if (p) ro.observe(p)
    }

    return {
      stop: () => {
        if (rafId != null) cancelAnimationFrame(rafId)
        if (ro) ro.disconnect()
      },
    }
  }

  /** @returns {{ stop(): void }} */
  function initSquareFlicker(canvas) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return { stop: () => {} }
    /** @type {number | null} */
    let rafId = null
    const SIZE = 6
    const GAP = 10
    const CARD_MIN_HEIGHT = 48
    let squares = /** @type {{ x: number; y: number; phase: number; speed: number; size: number }[]} */ ([])
    let w = 1
    let h = 1

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(CARD_MIN_HEIGHT, rect.height)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.floor(w / (SIZE + GAP)) + 1
      const rows = Math.floor(h / (SIZE + GAP)) + 1
      const count = cols * rows
      squares = Array.from({ length: count }, () => ({
        x: 0,
        y: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.06 + Math.random() * 0.12,
        size: SIZE * (0.6 + Math.random() * 0.5),
      }))
      let i = 0
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          if (i >= squares.length) break
          squares[i].x = GAP + c * (SIZE + GAP) + SIZE / 2
          squares[i].y = GAP + r * (SIZE + GAP) + SIZE / 2
          i += 1
        }
      }
    }

    resize()
    const draw = () => {
      const dark = aboutPromoThemeIsDark()
      ctx.fillStyle = dark ? 'rgba(60, 75, 95, 0.4)' : 'rgba(228, 237, 248, 0.85)'
      ctx.fillRect(0, 0, w, h)
      squares.forEach(s => {
        s.phase += s.speed
        const t = 0.5 + 0.5 * Math.sin(s.phase)
        const twinkle = 0.08 + 0.92 * t
        const alpha = twinkle * (dark ? 0.75 : 0.5)
        const half = (s.size / 2) * (0.75 + 0.35 * t)
        ctx.fillStyle = dark ? `rgba(100, 140, 200, ${alpha})` : `rgba(60, 100, 160, ${alpha})`
        ctx.fillRect(s.x - half, s.y - half, half * 2, half * 2)
      })
      rafId = requestAnimationFrame(draw)
    }
    draw()

    /** @type {ResizeObserver | null} */
    let ro = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      const p = canvas.parentElement
      if (p) ro.observe(p)
    }

    return {
      stop: () => {
        if (rafId != null) cancelAnimationFrame(rafId)
        if (ro) ro.disconnect()
      },
    }
  }

  /** @returns {(() => void) | void} */
  function startPhaseLoop() {
    let idx = 0
    const clearSegTimers = () => {
      if (yonoTimer1) clearTimeout(yonoTimer1)
      if (yonoTimer2) clearTimeout(yonoTimer2)
      if (expoTimer1) clearTimeout(expoTimer1)
      if (expoTimer2) clearTimeout(expoTimer2)
      yonoTimer1 = yonoTimer2 = expoTimer1 = expoTimer2 = null
    }
    const nextPhase = () => {
      if (phaseTimer) clearTimeout(phaseTimer)
      phaseTimer = null
      idx %= 2
      setPhase(idx)

      clearSegTimers()

      if (idx === 0) {
        startIpTyping()
        syncExpoSegments(0)
        syncYonoSegments(0)
        yonoTimer1 = setTimeout(() => syncYonoSegments(1), 750)
        yonoTimer2 = setTimeout(() => syncYonoSegments(2), 1500)
        expoTimer1 = setTimeout(() => syncExpoSegments(1), 750)
        expoTimer2 = setTimeout(() => syncExpoSegments(2), 1500)
        phaseTimer = setTimeout(() => {
          idx += 1
          nextPhase()
        }, 4200)
      } else {
        if (typedEl) typedEl.textContent = ''
        if (cursorEl) cursorEl.hidden = true
        if (typingTimer) {
          clearInterval(typingTimer)
          typingTimer = null
        }
        phaseTimer = setTimeout(() => {
          idx += 1
          nextPhase()
        }, 3800)
      }
    }

    nextPhase()
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setPhase(1)
    if (typedEl) typedEl.textContent = lookmyDemoFull
    if (cursorEl) cursorEl.hidden = true
    syncExpoSegments(2)
    syncYonoSegments(2)
    aboutPromoUnmount = () => {
      document.removeEventListener('addon-theme-change', onAddonThemeChange)
    }
    return
  }

  startPhaseLoop()

  requestAnimationFrame(() => {
    const c1 = root.querySelector('canvas[data-promo-canvas="lookmy"]')
    const c2 = root.querySelector('canvas[data-promo-canvas="expo"]')
    const c3 = root.querySelector('canvas[data-promo-canvas="yono"]')
    if (c1 instanceof HTMLCanvasElement) matrixHandle = initDotMatrix(c1)
    if (c2 instanceof HTMLCanvasElement) squareHandle = initSquareFlicker(c2)
    if (c3 instanceof HTMLCanvasElement) starfieldHandle = initStarfield(c3)
  })

  aboutPromoUnmount = () => {
    document.removeEventListener('addon-theme-change', onAddonThemeChange)
    matrixHandle?.stop()
    squareHandle?.stop()
    starfieldHandle?.stop()
    if (phaseTimer) clearTimeout(phaseTimer)
    if (typingTimer) clearInterval(typingTimer)
    if (yonoTimer1) clearTimeout(yonoTimer1)
    if (yonoTimer2) clearTimeout(yonoTimer2)
    if (expoTimer1) clearTimeout(expoTimer1)
    if (expoTimer2) clearTimeout(expoTimer2)
    matrixHandle = squareHandle = starfieldHandle = null
  }
}
