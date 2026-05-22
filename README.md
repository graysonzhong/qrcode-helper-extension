# 新意二维码助手 · 浏览器扩展

Microsoft Edge：**[新意二维码助手（商店安装）](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)**  
源码：**[GitHub](https://github.com/graysonzhong/qrcode-helper-extension)**

Manifest V3，本地生成或解析二维码图片，二维码与网址不上传远端。许可见根目录 **`LICENSE`**（MIT）。

## 开发与本地加载

```bash
npm install
npm run build
```

浏览器打开 `edge://extensions` 或 `chrome://extensions`，开发者模式开启后「加载解压缩的扩展」，选择 **`manifest.json` 所在文件夹**。

若本目录在更大的工程里叫作 `extension/`，在子目录执行以上命令即可。
