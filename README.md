# Xinyi QR Assistant · Browser Extension

<p align="left">
  <a href="./README.md"><img src="https://img.shields.io/badge/lang-English-555555?labelColor=%23333" alt="English" /></a>
  &nbsp;<a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/lang-简体中文-555555?labelColor=%23333" alt="简体中文" /></a>
  &nbsp;<a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/lang-繁體中文-555555?labelColor=%23333" alt="繁體中文" /></a>
</p>

[![Microsoft Edge — Add-ons](https://img.shields.io/badge/Microsoft%20Edge-Add--ons-purple?logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)
[![MIT License](https://img.shields.io/badge/license-MIT-555?labelColor=blue)](./LICENSE)

**Manifest V3** extension for Microsoft Edge / Chromium: generate QR codes from the active tab URL, decode from images/videos/local files, export locally (PNG / JPG / SVG). Processing stays in the browser; **extension content is not sent to vendor servers.**

---

## Install from Edge Add-ons

[Install from Microsoft Edge Add-ons →](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)

---

## Developer build & load unpacked

```bash
npm install
npm run build
```

Open `edge://extensions` or `chrome://extensions`, enable **Developer mode**, **Load unpacked**, and choose the folder that contains **`manifest.json`**.

If this tree lives inside a larger monorepo as `extension/`, run the commands inside that folder.

---

## Source / license

- Repository: **[graysonzhong/qrcode-helper-extension](https://github.com/graysonzhong/qrcode-helper-extension)**  
- License: **[MIT](./LICENSE)**

---

## Releases

Store-aligned packages (e.g. **1.0.1**) are on **[GitHub Releases](https://github.com/graysonzhong/qrcode-helper-extension/releases)**.

---

## About the product

**Xinyi QR Assistant** generates and decodes QR codes in your local browser. Webpage URLs you use and images you decode are **not uploaded** to remote servers; core features work without cloud APIs (except when you **choose to open** an external link from a decoded result).

---

## About the publisher

**Shenzhen Yonovelty Information Technology Co., Ltd.** (深圳市柚新意信息技术有限责任公司) is an IT solutions provider and original software vendor. We deliver digital solutions for enterprise ecosystems through FDE-driven value delivery, AI enablement, and DevOps automation — secure, high-performance, maintainable applications.

---

## Contact

| | |
| --- | --- |
| **Phone** | [+86 191 4646 6617](tel:+8619146466617) |
| **Email** | [zgs@yonovelty.com](mailto:zgs@yonovelty.com) |
| **Website** | [yonovelty.com](https://www.yonovelty.com/) |
| **Address** | Room 212, Building 2, Futong Haizhi Technology Park, No. 17 Bulan Road, Xialilang Community, Nanwan Street, Longgang District, Shenzhen, China |

For WeChat / WeCom QR-style imagery, open the extension **About** page in Edge.

---

## Other products & services

| Site | Tagline (short) |
| --- | --- |
| [**lookmy.net**](https://lookmy.net) | Network check helper |
| [**lookmy.show**](https://lookmy.show) | Nationwide expo search (expos · calendar · sales) |
| [**yonovelty.com**](https://www.yonovelty.com) | Custom software · deep integration & IT services |

Capability highlights promoted in-product: **private CRM**, **CMS**, **AI delivery** (exact wording varies by UI language).
