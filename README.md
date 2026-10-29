<p align="center"><img src="public/assets/brand/icon-rounded.png" width="128" alt="Zoo logo" /></p>
<h1 align="center">Zoo / 小小动物岛</h1>
<p align="center">供家长陪伴 1.5–3 岁宝宝使用的中文看图认知小岛。</p>
<p align="center"><a href="https://zoo.hexly.ai">网站</a> · <a href="docs/README.en.md">English</a> · <a href="https://hexly.ai/projects/zoo">Hexly 项目档案</a></p>

## 这是什么

Zoo 是一个静态网页应用，用纸感卡通插画帮助孩子认识身边的世界。不测验、不排名、无广告、无需登录。建议亲子短时共同使用；数字 1–30、字母和汉字是可选的探索内容，不是这一年龄必须掌握的学习目标。

收藏保存在当前浏览器的本地存储中。网站没有账号、行为统计、广告或麦克风请求。朗读只播放预先生成的 MP3：保留已完成的 Gemini 录音，缺失中文和英文暂用 Edge 录音补齐，不调用浏览器实时朗读。

## 功能

- 253 张认知卡，覆盖十二个分类；卡片包含拼音或字母大小写、名称及简短介绍。
- 全屏看图，支持左右滑动、前后翻页及电脑方向键；Escape 或关闭按钮返回原卡片并恢复焦点。
- 动物生活环境筛选、1–30 连续浏览、随机探索、本机收藏及独立的中英文点读按钮；打开或切换卡片不自动朗读。
- 253 张插画分别提供 640 × 560 缩略图和原生 2048 × 1792 全屏 WebP，详情页预加载前后各两张图片；数字搭配对应数量的物品，字母搭配联想插画。
- 可添加到 iPhone 主屏幕，有限离线使用；右上角提供 Hexly 项目档案入口。

| 分类 | 卡片数量 |
| --- | ---: |
| 动物朋友 | 29 |
| 认识数字 | 30 |
| 认识字母 | 26 |
| 汉字宝宝 | 20 |
| 开口说说 | 29 |
| 天气自然 | 25 |
| 身边物品 | 31 |
| 缤纷水果 | 26 |
| 交通工具 | 10 |
| 蔬菜 | 9 |
| 饭桌食物 | 10 |
| 一起出门 | 8 |

## 使用

打开 [zoo.hexly.ai](https://zoo.hexly.ai)，选择分类后点击卡片。建议每次与孩子一起使用 5–10 分钟，再去真实的世界指一指、找一找。

在 iPhone 的 Safari 中点击“分享”→“添加到主屏幕”，可用「小小动物岛」独立打开。联网访问后，应用界面和最多 48 张最近浏览图片可以离线使用；未缓存图片仍需联网。音频和健康接口不进入离线缓存，不保证离线朗读。iOS 可能清理浏览器存储。关闭小岛的所有窗口再打开，才能启用已下载的新版本。

新增 77 张卡片的插画、文案已获批准，154 条 Edge 双语全文录音已按生成与发布授权完成并集成，尚未经逐条听审发音；原 176 张卡片的内容和媒体 URL 保持不变。本轮已补充 55 条 Gemini 中文录音，剩余 22 条中文和 77 条英文继续使用完整 Edge 录音；服务端限额停止后不自动续跑。Gemini 优先于 Edge，构建只选择已完成录音，不调用服务。没有语音定时任务；后续生成、版本与部署由主控按单独授权执行。当前阶段与录音保留规则见 [扩展记录](docs/03-content-expansion.md) 和 [AGENTS.md](AGENTS.md)。

## 开发

使用 Node.js 22.18+ 或 24+ 与 npm。本机安装须遵循机器的批准镜像源政策。

```sh
npm ci
npm run dev
npm run check
npm run build
```

开发服务监听 `127.0.0.1:7058`，本机 Caddy 提供 `https://zoo.dev.hexly.ai`。`npm run preview` 在相同端口预览构建结果，运行前应停止开发服务。Service Worker 仅在生产构建中注册；离线验证请在保留测试端口使用生产预览，不要缓存开发服务器。

```sh
npm run preview -- --port 17058
```

部署使用仓库安装的 Wrangler 和操作者已有的 Cloudflare 登录：

```sh
npm run deploy
```

`wrangler.jsonc` 将静态资源 Worker `zoo` 绑定到 `zoo.hexly.ai`。无应用后端、数据库、绑定或运行时密钥。本仓未迁移到 `cf` 项目配置；已安装 CLI 的 `cf pages deploy` 是旧命令占位，不能替代本仓的 Wrangler Worker 部署。

构建生成匿名 `GET /api/live` JSON，包含 `status: "ok"`、`package.json` 的顶层 `version` 和构建时 Git HEAD 的 `revision`，响应为 `Cache-Control: no-store`。它只证明静态部署的可访问性与构建身份，不检查语音供应商或其他外部服务。发布必须从已提交源码构建，使 revision 与部署源码一致。

## 测试

```sh
npm run check
npm run build
node scripts/check-pwa.mjs
node --experimental-strip-types scripts/check-audio-player.ts
python3 -B scripts/check-audio-schedule.py
python3 -B scripts/generate-edge-audio.py --check
python3 -B scripts/generate-audio.py --check --bilingual-day --until-provider-error
npm run check:live
```

内容检查验证分类数量、唯一 ID、图片存在性和数字读法；构建检查 TypeScript。PWA 检查覆盖应用文件、图片缓存上限、离线入口、缺图提示及音频/健康接口绕过缓存。健康检查使用无账号、无远端绑定的临时本地 Worker，使用随机分配的本地端口，验证 GET/HEAD、JSON、版本、revision 和禁止缓存。已安装 workerd 的最新支持日期为 2026-10-08，本地测试配置明确使用此日期；生产保留 2026-10-09，须另行在线验收。

已有 Chromium 烟测覆盖分类、筛选、收藏持久化、全屏导航与关闭、数字 30、家长信息及 320/390/768/1440 px 布局；Chromium 也验证了离线重开和图片。WebKit 验证了在线移动布局与导航，但自动化离线重载返回内部错误。真实 iPhone 主屏幕、状态栏、离线使用及 iOS/Android 触摸和实际发音仍需设备验证。这些是基础验证，不是完整质量审计。

## 技术栈

- React、TypeScript、Vite：静态应用、交互与构建。
- [animal-island-ui](https://github.com/guokaigdg/animal-island-ui)：界面控件与基础样式；`naive-icons`：界面图标。
- 原生 Service Worker、Web App Manifest 与静态 MP3 录音：有限离线、主屏幕安装与朗读。
- Cloudflare Workers Static Assets：静态托管与构建健康文件。

## 文档

- [文档目录与双语 Gemini 录音计划](docs/README.md)
- [维护约定与本地语音任务](AGENTS.md)
- [高清插画原始记录与导出流程](design/art/hd/README.md)
- [Hexly 项目档案](https://hexly.ai/projects/zoo)

`public/art/hd/` 和 `public/art/expansion/` 分别包含原 176 张及新增 77 张插画的高清图与缩略图，首页不下载整个集合。`public/art/hero.webp` 保留原始主视觉；旧图集分辨率素材归档在 `design/art/legacy-delivery/`。`design/art/` 保留原始 PNG、提示词、行优先主题顺序、处理脚本和联系表。卡片插画由 Azure OpenAI `gpt-image-2.5-sunburst` 通过 Workflow 图像生成流程制作。UI 库和图标包在各自分发包中保留 MIT 声明。

## 许可证

[MIT](LICENSE)。
