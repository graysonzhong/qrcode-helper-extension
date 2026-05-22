# 新意二維碼助手 · 瀏覽器擴充功能

<p align="left">
  <a href="./README.md"><img src="https://img.shields.io/badge/lang-English-555555?labelColor=%23333" alt="English" /></a>
  &nbsp;<a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/lang-简体中文-555555?labelColor=%23333" alt="简体中文" /></a>
  &nbsp;<a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/lang-繁體中文-555555?labelColor=%23333" alt="繁體中文" /></a>
</p>

[![Microsoft Edge — 附加元件](https://img.shields.io/badge/Microsoft%20Edge-附加元件-purple?logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)
[![MIT License](https://img.shields.io/badge/license-MIT-555?labelColor=blue)](./LICENSE)

**Manifest V3** 的 Edge / Chromium 擴充功能：自目前分頁網址產生二維碼、從圖片/影片/檔案解碼、匯出 PNG/JPG/SVG。處理在本機瀏覽器內完成；**不向廠商自有伺服器上傳**二維碼相關業務資料。

---

## 從 Edge 附加元件安裝

[前往 Microsoft Edge 附加元件安裝 →](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)

---

## 本機開發與載入解壓縮

```bash
npm install
npm run build
```

開啟 `edge://extensions` 或 `chrome://extensions`，啟用「開發人員模式」，「載入解壓縮」，選取含 **`manifest.json`** 的資料夾。

若此目錄在 Monorepo 中為 `extension/`，請在該子目錄執行上述指令。

---

## 原始碼與授權

- 儲存庫：**[graysonzhong/qrcode-helper-extension](https://github.com/graysonzhong/qrcode-helper-extension)**  
- 授權：**[MIT](./LICENSE)**

---

## 發行檔

與商店結構一致的 zip（例如 **1.0.1**）見 **[GitHub Releases](https://github.com/graysonzhong/qrcode-helper-extension/releases)**。

---

## 關於本擴充功能（與擴充功能內文一致）

**新意二維碼助手**於本機瀏覽器完成二維碼產生與解析：**不向遠端伺服器上傳**您存取的頁面網址或解碼所用圖片；核心功能可不依賴雲端介面（若解碼結果為網址，由您自行開啟外部連結時除外）。

---

## 開發者 / 公司簡介

**深圳市柚新意資訊技術有限責任公司**為專業 IT 服務商，作為軟體源頭供應商，提供深入企業生態的數智化解決方案，透過 FDE 價值交付、AI 賦能與 DevOps 自動化，為客戶交付安全、高效能且易於維護的企業級應用。

---

## 聯絡方式

| | |
| --- | --- |
| **電話** | [191 4646 6617](tel:+8619146466617) |
| **信箱** | [zgs@yonovelty.com](mailto:zgs@yonovelty.com) |
| **官網** | [yonovelty.com](https://www.yonovelty.com/) |
| **地址** | 深圳市龍崗區南灣街道下李朗社區布瀾路17號富通海智科技園2棟212 |

### 聯絡用圖（與擴充功能套件內資源一致）

GitHub README 無法執行擴充功能介面；以下為 **`extension-assets`** 中與內建「關於」頁**同源**的 SVG（與上架 zip／載入解壓縮目錄內為同一檔案）。若需與實際掃碼流程一致，仍建議於瀏覽器開啟擴充功能 **「關於」** 頁。

<table align="center">
  <tr>
    <td align="center" width="50%"><strong>微信</strong><br/><a href="./extension-assets/wx-gray.svg"><img src="./extension-assets/wx-gray.svg" height="132" alt="微信聯絡圖示"/></a></td>
    <td align="center" width="50%"><strong>企業微信</strong><br/><a href="./extension-assets/qywx-gray.svg"><img src="./extension-assets/qywx-gray.svg" height="132" alt="企業微信聯絡圖示"/></a></td>
  </tr>
</table>

淺色／深色另有 `wx-white.svg`、`qywx-white.svg`（同目錄），可依背景選用。

---

## 其他產品與服務（與擴充功能內推廣區一致）

| 網站 | 一句話定位 |
| --- | --- |
| [**lookmy.net**](https://lookmy.net) | 網路檢查小助手 |
| [**lookmy.show**](https://lookmy.show) | 全國展會查詢（展會 · 日曆 · 銷售） |
| [**yonovelty.com**](https://www.yonovelty.com) | 軟體定制 · 深度整合與 IT 服務 |

### README 靜態「推廣條」（近似底部三卡）

擴充功能內三塊推廣為 **Canvas 動畫**，無法在 README 重現。以下為儲存庫內新增的 **靜態 SVG 橫幅**，點擊可前往對應網站：

<p align="center">
  <a href="https://lookmy.net"><img src="./readme-assets/promo-lookmy.svg" height="104" alt="LOOKMY.NET"/></a><br/><br/>
  <a href="https://lookmy.show"><img src="./readme-assets/promo-show.svg" height="104" alt="lookmy.show"/></a><br/><br/>
  <a href="https://www.yonovelty.com"><img src="./readme-assets/promo-yonovelty.svg" height="104" alt="柚新意"/></a>
</p>

擴充功能內另有標籤：**私有 CRM**、**信創 CMS**、**AI 落地**（用語可能隨介面語言略有差異）。
