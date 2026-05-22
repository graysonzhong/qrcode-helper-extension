# 新意二维码助手 · 浏览器扩展

<p align="left">
  <a href="./README.md"><img src="https://img.shields.io/badge/lang-English-555555?labelColor=%23333" alt="English" /></a>
  &nbsp;<a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/lang-简体中文-555555?labelColor=%23333" alt="简体中文" /></a>
  &nbsp;<a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/lang-繁體中文-555555?labelColor=%23333" alt="繁體中文" /></a>
</p>

[![Microsoft Edge — 加载项](https://img.shields.io/badge/Microsoft%20Edge-加载项-purple?logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)
[![MIT License](https://img.shields.io/badge/license-MIT-555?labelColor=blue)](./LICENSE)

**Manifest V3** 的 Edge / Chromium 扩展：当前页链接生成二维码、图片/视频/文件解码、本机导出（PNG / JPG / SVG）。数据在浏览器本地处理，**不向厂商自有服务器上传二维码或网页内容。**

## 从 Edge 商店安装

[前往 Microsoft Edge 加载项安装 →](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)

## 本地开发与加载未打包

```bash
npm install
npm run build
```

打开 `edge://extensions` 或 `chrome://extensions`，开启**开发人员模式**，**加载解压缩的扩展**，选择包含 **`manifest.json`** 的目录。

若本目录在 Monorepo 中名为 `extension/`，在子目录执行以上命令即可。

## 源码与许可

- 仓库：**[graysonzhong/qrcode-helper-extension](https://github.com/graysonzhong/qrcode-helper-extension)**  
- 许可：**[MIT](./LICENSE)**

## 发行包

与商店提交结构一致的 zip 见 **[GitHub Releases](https://github.com/graysonzhong/qrcode-helper-extension/releases)**（如 `1.0.1`）。
