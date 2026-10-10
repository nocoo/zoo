# Zoo / 小小动物岛

A warm, colorful Chinese picture-learning island for children aged 1.5-3 and their families. Built with [animal-island-ui](https://github.com/guokaigdg/animal-island-ui), React and TypeScript.

一个适合家长陪伴 1.5–3 岁宝宝使用的中文看图认知网站。以动物为主角，用统一的纸感卡通插画认识身边的世界。不测验、不排名、无广告、无需登录。

- Production / 正式网站: https://zoo.hexly.ai
- Local / 本地网站: https://zoo.dev.hexly.ai

## Content / 内容

| Category / 分类 | Cards / 数量 |
| --- | ---: |
| Animal friends / 动物朋友 | 20 |
| Numbers / 认识数字 | 100 |
| Letters / 认识字母 | 26 |
| Chinese characters / 汉字宝宝 | 20 |
| Everyday phrases / 开口说说 | 20 |
| Weather and nature / 天气自然 | 20 |
| Everyday objects / 身边物品 | 20 |
| Fruit / 缤纷水果 | 20 |

Tap a card for a full-viewport illustration, pronunciation and a short explanation. Swipe left/right, use the previous/next controls or desktop arrow keys to browse. Escape or the close control returns to the focused card. Save favorites on the current device. Browser speech reads Chinese cards and English letters; the voice and availability depend on the device.

点击卡片进入全屏看图，显示拼音和简短介绍；支持左右滑动、前后翻页、电脑方向键、随机探索及本机收藏。浏览器语音朗读中文内容和英文字母，实际音色与可用性取决于设备。建议亲子短时共同使用，数字 1–100、字母和汉字并非这一年龄必须掌握的学习目标。

## Development / 开发

Use Node.js 22.18+ or 24+ and npm.

```sh
npm ci
npm run dev
npm run check
npm run build
```

Development listens on `127.0.0.1:7058`. The local Caddy mapping supplies HTTPS at `zoo.dev.hexly.ai`. On this machine use the approved package registry described in the global workflow instructions.

## Install On iPhone / 添加到 iPhone 主屏幕

Open the site in Safari, tap Share, then Add to Home Screen. The standalone app is named **小小动物岛** and uses an opaque Apple Touch Icon. After an online visit, the app shell and a bounded set of recently viewed images can work offline; uncached images need a connection. System speech may require a network connection, and iOS may evict stored data. Close all island windows and reopen to activate an installed update.

用 Safari 打开网站，点“分享”→“添加到主屏幕”，即可用「小小动物岛」图标独立打开。联网访问后，可离线进入并查看部分最近浏览的图片；未保存的图片仍需联网，系统语音不保证离线可用，iOS 也可能清理缓存。更新后请关闭小岛的所有窗口再打开。

PWA validation: `npm run build && node scripts/check-pwa.mjs`. The service worker is registered only in production builds; use Vite preview for local offline verification. Icon derivation and caching rules are documented in `AGENTS.md`.

## Deployment / 部署

```sh
npm run deploy
```

The assets-only Cloudflare Worker is named `zoo`; `wrangler.jsonc` configures `zoo.hexly.ai`. It needs no backend, bindings or secrets. The deployment CLI uses the operator's existing Cloudflare authentication. `cf pages deploy` is a legacy-command stub in the installed CLI, so this project uses supported Worker static assets through Wrangler instead of adding a new framework integration.

## Artwork / 插画

- `public/art/hd/`: all 120 illustrated cards, each with a lazy-loaded 640 x 560 thumbnail and a separate native 2048 x 1792 full-screen WebP loaded on opening. The 240 lossless assets total approximately 246 MiB; the initial page does not download the full collection.
- `public/art/hero.webp`: the original hero illustration. Previous atlas-resolution cards remain archived under `design/art/legacy-delivery/`, not as active website assets.
- `design/art/`: original PNG generations, prompts, row-major subject orders, processing script and visual contact sheets.
- Model: Azure OpenAI `gpt-image-2.5-sunburst`, called through the Workflow image-generation skill.
- UI icons: `naive-icons`; the reference UI library and icon package retain their MIT notices in their distributions.

## Privacy And Validation / 隐私与验证

Favorites stay in browser local storage. There are no accounts, analytics, advertising or microphone requests. Speech uses the browser/OS; some system voices may use network services.

`npm run check` verifies content and assets; `npm run build` checks types and builds the site. Initial Chromium smoke checks cover category selection, animal filters, favorites persistence, modal navigation and closing, number 100, parent information, and 320/390/768/1440 px layouts. These are basic checks, not a comprehensive test suite. Actual audio quality and touch behavior on physical iOS/Android devices still require device verification.

## License

MIT. See [LICENSE](LICENSE).
