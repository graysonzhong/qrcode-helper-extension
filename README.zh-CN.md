# 新意二维码助手 · 浏览器扩展

<p align="left">
  <a href="./README.md"><img src="https://img.shields.io/badge/lang-English-555555?labelColor=%23333" alt="English" /></a>
  &nbsp;<a href="./README.zh-CN.md"><img src="https://img.shields.io/badge/lang-简体中文-555555?labelColor=%23333" alt="简体中文" /></a>
  &nbsp;<a href="./README.zh-TW.md"><img src="https://img.shields.io/badge/lang-繁體中文-555555?labelColor=%23333" alt="繁體中文" /></a>
</p>

[![Microsoft Edge — 加载项](https://img.shields.io/badge/Microsoft%20Edge-加载项-purple?logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)
[![MIT License](https://img.shields.io/badge/license-MIT-555?labelColor=blue)](./LICENSE)

**Manifest V3** 的 Edge / Chromium 扩展：当前页链接生成二维码、图片/视频/本地文件解码、导出 PNG/JPG/SVG。处理在本机浏览器内完成；**不向厂商自有服务器上传**二维码相关业务数据。

---

## 从 Edge 商店安装

[前往 Microsoft Edge 加载项安装 →](https://microsoftedge.microsoft.com/addons/detail/%E6%96%B0%E6%84%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%8A%A9%E6%89%8B/cmdjefcipmckabkdnmbcfiejfcckkeek)

---

## 本地开发与加载未打包

```bash
npm install
npm run build
```

打开 `edge://extensions` 或 `chrome://extensions`，开启「开发人员模式」，「加载解压缩的扩展」，选择包含 **`manifest.json`** 的目录。

若本目录在 Monorepo 中为 `extension/`，在上述子目录执行命令即可。

---

## 源码与许可

- 仓库：**[graysonzhong/qrcode-helper-extension](https://github.com/graysonzhong/qrcode-helper-extension)**  
- 许可：**[MIT](./LICENSE)**

---

## 发行包

与商店结构一致的 zip（例如 **1.0.1**）见 **[GitHub Releases](https://github.com/graysonzhong/qrcode-helper-extension/releases)**。

---

## 关于本扩展（与扩展内文案一致）

**新意二维码助手**在本机浏览器内完成二维码生成与解析：**不向远程服务器上传**您访问的页面地址或解码用图片；核心功能可不依赖云端接口（若解码结果为网址，由您自行打开外链时除外）。

---

## 开发者 / 公司简介

**深圳市柚新意信息技术有限责任公司**是一家专业的 IT 服务商，作为软件源头供应商，提供深入企业生态的数智化解决方案，通过 FDE 价值交付、AI 赋能和 DevOps 自动化，为客户交付安全、高性能且易于维护的企业级应用。

---

## 联系方式

| | |
| --- | --- |
| **电话** | [191 4646 6617](tel:+8619146466617) |
| **邮箱** | [zgs@yonovelty.com](mailto:zgs@yonovelty.com) |
| **官网** | [yonovelty.com](https://www.yonovelty.com/) |
| **地址** | 深圳市龙岗区南湾街道下李朗社区布澜路17号富通海智科技园2栋212 |

微信 / 企业微信联系图示建议在浏览器中打开扩展的 **「关于」** 页查看。

---

## 其他产品与服务（与扩展内推广区一致）

| 站点 | 一句话定位 |
| --- | --- |
| [**lookmy.net**](https://lookmy.net) | 网络检查小助手 |
| [**lookmy.show**](https://lookmy.show) | 全国展会查询（展会 · 日历 · 销售） |
| [**yonovelty.com**](https://www.yonovelty.com) | 软件定制 · 深度集成和 IT 服务 |

扩展内另有标签：**私有 CRM**、**信创 CMS**、**AI 落地**（措辞随界面语言可能略有差异）。
