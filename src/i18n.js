/** @typedef {'auto'|'zh-CN'|'zh-TW'|'en'} LocaleMode */

/** @type {LocaleMode} */
let localeMode = 'auto'

/** @type {Record<string, Record<string, string>>} */
const MESSAGES = {
  'zh-CN': {
    appTitle: '新意二维码助手',
    tabsAria: '功能',
    tab_current: '当前页',
    tab_decode: '码转链接',
    tab_encode: '链接转码',
    current_qr_aria: '二维码',
    current_unavailable_title: '当前无法获取链接',
    current_unavailable_desc:
      '浏览器未向扩展提供该页地址（常见于新建标签页或部分内置页），请到普通网页再试，或使用「链接转码」手动粘贴地址。',
    current_download: '下载二维码',
    current_more_styles: '更多样式',
    current_fail_gen_title: '二维码生成失败',
    current_fail_gen_desc: '请稍后重试或切换到其它标签页',
    decode_drop_aria:
      '导入二维码：支持 PNG、JPEG、WebP、GIF、SVG、TIFF、AVIF、HEIC/HEIF 及常见短视频首帧（如 Live Photo 的 MOV）；可拖入，或在窗口内 Ctrl+V 粘贴截图、SVG 源码或 data:image…，亦可点击下方按钮选择文件。',
    decode_hit_title: '拖入文件 · 粘贴 · 点击上传',
    decode_hit_sub:
      '支持多种图片与视频（截取首帧解码）。将文件拖入此处，或在扩展窗口内 Ctrl+V 粘贴截图、SVG 源代码或图片 Data URL；亦可点击下方按钮从设备选择。',
    decode_pick_file: '选择文件',
    decode_busy_title: '正在解析二维码…',
    decode_busy_hint: '请稍候',
    decode_slow_hint:
      '解析已超过预期时间。若图中可能不是有效二维码，可点击「取消解析」；若是较大或较难识别的图片，也可能需要更久，请稍候。',
    decode_cancel: '取消解析',
    decode_compact_done: '解析完成',
    decode_fail_short: '未识别出二维码',
    decode_image_bad: '图片无法加载',
    decode_preview_aria: '解析二维码',
    decode_result_label: '解析结果',
    decode_fail_lead: '无法解析',
    decode_fail_note:
      '未能从图中识别出二维码。透明底会先合成到白/黑底再解析；对比度极低时还会做分位拉伸与局部阈值。若仍失败，请尽量导出更大尺寸或裁掉多余留白。TIFF 在本机解码；HEIC 依赖系统/浏览器解码，无法载入时可先导出 JPEG/PNG。',
    decode_copy: '复制',
    decode_copied: '已复制',
    encode_label_content: '内容',
    encode_label_fg: '码点',
    encode_label_bg: '背景',
    encode_label_ecc: '容错',
    encode_label_size: '尺寸',
    encode_color_aria: '颜色',
    encode_alpha_aria: '透明度',
    encode_hex_aria: '#代码',
    ecc_L_label: '低',
    ecc_L_title: '约可纠正 7% 以内的破损',
    ecc_M_label: '中',
    ecc_M_title: '约可纠正 15% 以内的破损，日常使用推荐',
    ecc_Q_label: '较高',
    ecc_Q_title: '约可纠正 25% 以内的破损，适合印刷或略远距离',
    ecc_H_label: '最高',
    ecc_H_title: '约可纠正 30% 以内的破损，适合户外或易磨损场景',
    ecc_select_title:
      '纠错级别越高，二维码在破损、污渍、遮挡下仍能被识别的能力越强，但图案会更密集、扫描距离要求可能更高。',
    encode_preview_aria: '预览',
    dl_png: '下载PNG',
    dl_jpg: '下载JPG',
    dl_svg: '下载SVG',
    copy_svg_code: 'SVG代码复制',
    split_format_aria: '格式',
    menu_svg_code: 'SVG代码',
    toast_enter_content: '请输入内容',
    toast_bad_color: '颜色无效',
    toast_copied: '已复制',
    toast_copy_fail: '复制失败',
    toast_fail: '失败',
    toast_no_qr_current: '当前无法生成二维码',
    theme_auto: '自适应',
    theme_dark: '黑夜',
    theme_light: '白天',
    theme_menu_aria: '外观',
    lang_menu_aria: '语言',
    lang_auto: '语言自动',
    lang_zhCN: '简体中文',
    lang_zhTW: '繁體中文',
    lang_en: 'English',
    footer_about: '关于',
    about_page_title: '关于',
    about_back: '返回',
    about_back_aria: '返回',
    about_company_name: '深圳市柚新意信息技术有限责任公司',
    about_logo_alt: '柚新意',
    about_product_title: '关于产品：',
    about_product_html:
      '<p class="about-section-body"><strong>新意二维码助手</strong>在本机浏览器内完成二维码生成与解析：不向任何远程服务器上传您访问的页面地址或解码用的图片，核心功能无需依赖云端接口即可使用（若解析结果为网址，您自行打开外链时除外）。</p>',
    about_company_title: '公司介绍：',
    about_company_body:
      '深圳市柚新意信息技术有限责任公司是一家专业的 IT 服务商，作为软件源头供应商，我们提供深入企业生态的数智化解决方案，通过 FDE 价值交付、AI 赋能和 DevOps 自动化，为客户交付安全、高性能且易于维护的企业级应用。',
    contact_section_aria: '联系方式',
    contact_phone_label: '电话：',
    contact_email_label: '邮箱：',
    contact_web_label: '官网：',
    contact_address_label: '地址：',
    contact_address_value: '深圳市龙岗区南湾街道下李朗社区布澜路17号富通海智科技园2栋212',
    contact_wechat_caption: '微信联系',
    contact_wechat_alt: '微信二维码',
    contact_qywx_caption: '企业微信联系',
    contact_qywx_alt: '企业微信二维码',
    about_other_products_title: '其他产品和服务：',
    promo_lookmy_demo: 'IP：120.xx.xx.xx  深圳',
    promo_lookmy_sub: '网络检查小助手',
    promo_expo_1: '展会',
    promo_expo_2: '日历',
    promo_expo_3: '销售',
    promo_list_sep: '、',
    promo_show_sub: '全国展会查询',
    promo_yono_1: '私有CRM',
    promo_yono_2: '信创CMS',
    promo_yono_3: 'AI落地',
    promo_orange_title: '软件定制',
    promo_orange_sub: '深度集成和IT服务',
    file_qr_png: '二维码.png',
    file_qr_jpg: '二维码.jpg',
    file_qr_svg: '二维码.svg',
    modal_close_aria: '关闭',
  },
  'zh-TW': {
    appTitle: '新意二維碼助手',
    tabsAria: '功能',
    tab_current: '目前頁面',
    tab_decode: '碼轉連結',
    tab_encode: '連結轉碼',
    current_qr_aria: '二維碼',
    current_unavailable_title: '目前無法取得連結',
    current_unavailable_desc:
      '瀏覽器未向擴充功能提供該頁網址（常見於新分頁或部分內建頁），請改至一般網頁再試，或使用「連結轉碼」手動貼上網址。',
    current_download: '下載二維碼',
    current_more_styles: '更多樣式',
    current_fail_gen_title: '二維碼產生失敗',
    current_fail_gen_desc: '請稍後再試或切換到其他分頁',
    decode_drop_aria:
      '匯入二維碼：支援 PNG、JPEG、WebP、GIF、SVG、TIFF、AVIF、HEIC/HEIF 與常見短片首畫格（如 Live Photo 的 MOV）；可拖曳，或在視窗內 Ctrl+V 貼上截圖、SVG 原始碼或 data:image…，亦可點選下方按鈕選擇檔案。',
    decode_hit_title: '拖曳檔案 · 貼上 · 點選上傳',
    decode_hit_sub:
      '支援多種圖片與影片（擷取首畫格解碼）。將檔案拖曳至此，或於擴充功能視窗內 Ctrl+V 貼上截圖、SVG 原始碼或圖片 Data URL；亦可點選下方按鈕從裝置選擇。',
    decode_pick_file: '選擇檔案',
    decode_busy_title: '正在解析二維碼…',
    decode_busy_hint: '請稍候',
    decode_slow_hint:
      '解析已超過預期時間。若圖像可能不是有效的二維碼，可點選「取消解析」；若是較大或較難辨識的圖片，也可能需要更久，請稍候。',
    decode_cancel: '取消解析',
    decode_compact_done: '解析完成',
    decode_fail_short: '無法辨識二維碼',
    decode_image_bad: '圖片無法載入',
    decode_preview_aria: '解析二維碼',
    decode_result_label: '解析結果',
    decode_fail_lead: '無法解析',
    decode_fail_note:
      '未能從圖中辨識二維碼。透明底會先合成至白/黑底再解析；對比極低時另會做分位拉伸與局部閾值。若仍失敗，請盡量匯出較大尺寸或裁掉多餘留白。TIFF 於本機解碼；HEIC 依系統／瀏覽器解碼支援而定，無法載入時可先匯出 JPEG/PNG。',
    decode_copy: '複製',
    decode_copied: '已複製',
    encode_label_content: '內容',
    encode_label_fg: '模組',
    encode_label_bg: '背景',
    encode_label_ecc: '容錯',
    encode_label_size: '尺寸',
    encode_color_aria: '顏色',
    encode_alpha_aria: '透明度',
    encode_hex_aria: '#代碼',
    ecc_L_label: '低',
    ecc_L_title: '約可修正 7% 以內的破損',
    ecc_M_label: '中',
    ecc_M_title: '約可修正 15% 以內的破損，日常使用建議',
    ecc_Q_label: '較高',
    ecc_Q_title: '約可修正 25% 以內的破損，適合印刷或較遠距離',
    ecc_H_label: '最高',
    ecc_H_title: '約可修正 30% 以內的破損，適合戶外或易磨損場景',
    ecc_select_title:
      '容錯越高，二維碼在破損、汙漬、遮擋下越易被辨識，但圖樣會更密、掃描距離要求可能更高。',
    encode_preview_aria: '預覽',
    dl_png: '下載PNG',
    dl_jpg: '下載JPG',
    dl_svg: '下載SVG',
    copy_svg_code: 'SVG程式碼複製',
    split_format_aria: '格式',
    menu_svg_code: 'SVG程式碼',
    toast_enter_content: '請輸入內容',
    toast_bad_color: '顏色無效',
    toast_copied: '已複製',
    toast_copy_fail: '複製失敗',
    toast_fail: '失敗',
    toast_no_qr_current: '目前無法產生二維碼',
    theme_auto: '自動',
    theme_dark: '深色',
    theme_light: '淺色',
    theme_menu_aria: '外觀',
    lang_menu_aria: '語言',
    lang_auto: '語言自動',
    lang_zhCN: '简体中文',
    lang_zhTW: '繁體中文',
    lang_en: 'English',
    footer_about: '關於',
    about_page_title: '關於',
    about_back: '返回',
    about_back_aria: '返回',
    about_company_name: '深圳市柚新意資訊技術有限責任公司',
    about_logo_alt: '柚新意',
    about_product_title: '關於產品：',
    about_product_html:
      '<p class="about-section-body"><strong>新意二維碼助手</strong>於本機瀏覽器內完成二維碼產生與解析：不向任何遠端伺服器上傳您存取的頁面網址或解碼所用圖片，核心功能無需依賴雲端介面即可使用（若解析結果為網址，您自行開啟外部連結時除外）。</p>',
    about_company_title: '公司介紹：',
    about_company_body:
      '深圳市柚新意資訊技術有限責任公司為專業 IT 服務商，作為軟體源頭供應商，我們提供深入企業生態的數智化解決方案，透過 FDE 價值交付、AI 賦能與 DevOps 自動化，為客戶交付安全、高效能且易於維護的企業級應用。',
    contact_section_aria: '聯絡方式',
    contact_phone_label: '電話：',
    contact_email_label: '信箱：',
    contact_web_label: '官網：',
    contact_address_label: '地址：',
    contact_address_value: '深圳市龍崗區南灣街道下李朗社區布瀾路17號富通海智科技園2棟212',
    contact_wechat_caption: '微信聯繫',
    contact_wechat_alt: '微信二維碼',
    contact_qywx_caption: '企業微信聯繫',
    contact_qywx_alt: '企業微信二維碼',
    about_other_products_title: '其他產品與服務：',
    promo_lookmy_demo: 'IP：120.xx.xx.xx  深圳',
    promo_lookmy_sub: '網路檢查小助手',
    promo_expo_1: '展會',
    promo_expo_2: '日曆',
    promo_expo_3: '銷售',
    promo_list_sep: '、',
    promo_show_sub: '全國展會查詢',
    promo_yono_1: '私有CRM',
    promo_yono_2: '信創CMS',
    promo_yono_3: 'AI落地',
    promo_orange_title: '軟體定制',
    promo_orange_sub: '深度整合與IT服務',
    file_qr_png: '二維碼.png',
    file_qr_jpg: '二維碼.jpg',
    file_qr_svg: '二維碼.svg',
    modal_close_aria: '關閉',
  },
  en: {
    appTitle: 'Xinyi QR Assistant',
    tabsAria: 'Features',
    tab_current: 'This tab',
    tab_decode: 'Image to link',
    tab_encode: 'Text to QR',
    current_qr_aria: 'QR code',
    current_unavailable_title: 'Link unavailable',
    current_unavailable_desc:
      'The browser did not expose an address for this tab (common for new tabs or built-in pages). Open a normal webpage or paste the URL under “Text to QR”.',
    current_download: 'Download QR',
    current_more_styles: 'More styles',
    current_fail_gen_title: 'Could not generate QR',
    current_fail_gen_desc: 'Please try again later or switch to another tab.',
    decode_drop_aria:
      'Import QR media: PNG, JPEG, WebP, GIF, SVG, TIFF, AVIF, HEIC/HEIF, and short videos (first frame, e.g. Live Photo MOV). Drop files, paste a screenshot / SVG markup / data:image… with Ctrl+V, or choose a file below.',
    decode_hit_title: 'Drop · Paste · Upload',
    decode_hit_sub:
      'Supports images and videos (decodes the first frame). Drop here, press Ctrl+V for a screenshot, raw SVG, or a data URL, or use the button to pick a file from your device.',
    decode_pick_file: 'Choose file',
    decode_busy_title: 'Decoding QR…',
    decode_busy_hint: 'Please wait',
    decode_slow_hint:
      'Taking longer than expected. If this may not be a valid QR image, tap Cancel; large or difficult images may still need more time—please wait.',
    decode_cancel: 'Cancel',
    decode_compact_done: 'Decoded',
    decode_fail_short: 'No QR code found',
    decode_image_bad: 'Could not load image',
    decode_preview_aria: 'Decoded QR preview',
    decode_result_label: 'Result',
    decode_fail_lead: 'Unable to decode',
    decode_fail_note:
      'No QR code was found. Transparent backgrounds are flattened; very low contrast gets extra processing. Try a larger crop or fewer margins. TIFF is decoded locally; HEIC depends on OS/browser codecs—export to JPEG/PNG if it will not load.',
    decode_copy: 'Copy',
    decode_copied: 'Copied',
    encode_label_content: 'Content',
    encode_label_fg: 'Foreground',
    encode_label_bg: 'Background',
    encode_label_ecc: 'EC level',
    encode_label_size: 'Size',
    encode_color_aria: 'Color',
    encode_alpha_aria: 'Opacity',
    encode_hex_aria: 'Hex code',
    ecc_L_label: 'Low',
    ecc_L_title: '~7% damage recovery',
    ecc_M_label: 'Medium',
    ecc_M_title: '~15% damage recovery; recommended for daily use',
    ecc_Q_label: 'Quartile',
    ecc_Q_title: '~25% damage recovery; print / longer distance',
    ecc_H_label: 'High',
    ecc_H_title: '~30% damage recovery; harsh environments',
    ecc_select_title:
      'Higher error correction improves readability when damaged, but the pattern becomes denser and scanning distance may shrink.',
    encode_preview_aria: 'Preview',
    dl_png: 'Download PNG',
    dl_jpg: 'Download JPG',
    dl_svg: 'Download SVG',
    copy_svg_code: 'Copy SVG markup',
    split_format_aria: 'Format',
    menu_svg_code: 'SVG code',
    toast_enter_content: 'Enter content first',
    toast_bad_color: 'Invalid color',
    toast_copied: 'Copied',
    toast_copy_fail: 'Copy failed',
    toast_fail: 'Something went wrong',
    toast_no_qr_current: 'Cannot generate QR for this tab',
    theme_auto: 'Auto',
    theme_dark: 'Dark',
    theme_light: 'Light',
    theme_menu_aria: 'Appearance',
    lang_menu_aria: 'Language',
    lang_auto: 'Auto language',
    lang_zhCN: '简体中文',
    lang_zhTW: '繁體中文',
    lang_en: 'English',
    footer_about: 'About',
    about_page_title: 'About',
    about_back: 'Back',
    about_back_aria: 'Back',
    about_company_name: 'Shenzhen Yonovelty Information Technology Co., Ltd.',
    about_logo_alt: 'Yonovelty',
    about_product_title: 'About the Product:',
    about_product_html:
      '<p class="about-section-body"><strong>Xinyi QR Assistant</strong> generates and decodes QR codes entirely within your local browser environment. No webpage URLs you visit or images used for decoding are uploaded to any remote server. Core functionalities operate fully offline without relying on cloud-based APIs — except when you voluntarily open an external link contained in a decoded result.</p>',
    about_company_title: 'Company Introduction:',
    about_company_body:
      '深圳市柚新意信息技术有限责任公司 is a professional IT solutions provider and original software vendor. We deliver deeply integrated digital intelligence solutions for enterprise ecosystems through FDE-driven value delivery, AI enablement, and DevOps automation — empowering organizations with secure, high-performance, and maintainable enterprise-grade applications.',
    contact_section_aria: 'Contact',
    contact_phone_label: 'Phone:',
    contact_email_label: 'Email:',
    contact_web_label: 'Website:',
    contact_address_label: 'Address:',
    contact_address_value:
      'Room 212, Building 2, Futong Haizhi Technology Park, No. 17 Bulan Road, XIALILANG Community, Nanwan Street, Longgang District, Shenzhen',
    contact_wechat_caption: 'WeChat',
    contact_wechat_alt: 'WeChat QR',
    contact_qywx_caption: 'WeCom',
    contact_qywx_alt: 'WeCom QR',
    about_other_products_title: 'More products & services:',
    promo_lookmy_demo: 'IP: 120.xx.xx.xx  Shenzhen',
    promo_lookmy_sub: 'Network check helper',
    promo_expo_1: 'Expos',
    promo_expo_2: 'Calendar',
    promo_expo_3: 'Sales',
    promo_list_sep: ', ',
    promo_show_sub: 'Nationwide expo search',
    promo_yono_1: 'Private CRM',
    promo_yono_2: 'CMS',
    promo_yono_3: 'AI delivery',
    promo_orange_title: 'Custom software',
    promo_orange_sub: 'Integration & IT services',
    file_qr_png: 'qrcode.png',
    file_qr_jpg: 'qrcode.jpg',
    file_qr_svg: 'qrcode.svg',
    modal_close_aria: 'Close',
  },
}

const LANG_HTML = /** @type {const} */ ({
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  en: 'en',
})

/** @param {string | null | undefined} m */
export function normalizeLocaleMode(m) {
  if (m === 'zh-CN' || m === 'zh-TW' || m === 'en' || m === 'auto') return m
  return 'auto'
}

export function detectBrowserLocale() {
  const raw = (navigator.language || /** @type {any} */ (navigator).userLanguage || 'en').toLowerCase()
  if (raw === 'zh-tw' || raw === 'zh-hk' || raw === 'zh-mo') return 'zh-TW'
  if (raw.startsWith('zh')) return 'zh-CN'
  return 'en'
}

/** @returns {'zh-CN'|'zh-TW'|'en'} */
export function getEffectiveLocale() {
  if (localeMode === 'auto') return detectBrowserLocale()
  return localeMode
}

/** @param {LocaleMode} m */
export function setLocaleMode(m) {
  localeMode = normalizeLocaleMode(m)
}

/** @returns {LocaleMode} */
export function getLocaleMode() {
  return localeMode
}

/** @param {string} key */
export function t(key) {
  const loc = getEffectiveLocale()
  const pack = MESSAGES[loc] || MESSAGES.en
  const fallback = MESSAGES.en
  return pack[key] ?? fallback[key] ?? key
}

export function applyDocumentLang() {
  const eff = getEffectiveLocale()
  document.documentElement.lang = LANG_HTML[eff] ?? 'en'
}

/** @param {string} s */
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
