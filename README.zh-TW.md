# 新意二維碼助手 · 瀏覽器擴充功能

<p align="left">
  <a href="./README.md"><img src="https://img.shields.io/badge/lang-English-555555?labelColor=%23333" alt="English" /></a>
  &nbsp;<a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/lang-简体中文-555555?labelColor=%23333" alt="简体中文" /></a>
  &nbsp;<a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/lang-繁體中文-555555?labelColor=%23333" alt="繁體中文" /></a>
</p>

[![Microsoft Edge — 附加元件](https://img.shields.io/badge/Microsoft%20Edge-附加元件-purple?logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)
[![MIT License](https://img.shields.io/badge/license-MIT-555?labelColor=blue)](./LICENSE)

**Manifest V3** 的 Edge / Chromium 擴充功能：自目前分頁網址產生二維碼、從圖片/影片/檔案解碼、本機匯出（PNG / JPG / SVG）。資料在瀏覽器本機處理，**不向廠商自有伺服器上傳二維碼或網頁內容。**

## 從 Edge 附加元件安裝

[前往 Microsoft Edge 附加元件安裝 →](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)

## 本機開發與載入解壓縮

```bash
npm install
npm run build
```

開啟 `edge://extensions` 或 `chrome://extensions`，啟用**開發人員模式**，**載入解壓縮**，選取含 **`manifest.json`** 的資料夾。

若此目錄在 Monorepo 中為 `extension/`，請在該子目錄執行以上指令。

## 原始碼與授權

- 儲存庫：**[graysonzhong/qrcode-helper-extension](https://github.com/graysonzhong/qrcode-helper-extension)**  
- 授權：**[MIT](./LICENSE)**

## 發行檔

與商店提交結構一致的 zip 見 **[GitHub Releases](https://github.com/graysonzhong/qrcode-helper-extension/releases)**（例如 `1.0.1`）。
