<p align="center"><img src="../public/assets/brand/icon-rounded.png" width="128" alt="Zoo logo" /></p>
<h1 align="center">Zoo / 小小动物岛</h1>
<p align="center">A Chinese picture-learning island for children aged 1.5–3 to explore with an adult.</p>
<p align="center"><a href="https://zoo.hexly.ai">Website</a> · <a href="../README.md">简体中文</a> · <a href="https://hexly.ai/projects/zoo">Hexly project archive</a></p>

## What It Does

Zoo is a static web app that introduces the everyday world through paper-textured cartoon illustrations. There are no quizzes, rankings, ads or login. Keep sessions short and shared with an adult; numbers 1–30, letters and Chinese characters are optional exploration, not developmental requirements for this age group.

Favorites stay in the current browser's local storage. There are no accounts, analytics, advertisements or microphone requests. Narration plays pregenerated MP3 files only. Completed Gemini recordings are preserved; temporary Edge recordings fill missing Mandarin and English audio. There is no browser speech synthesis or runtime TTS.

## Features

- 253 cards across twelve categories, with pinyin or letter case, a name and a short description.
- Full-viewport pictures with swipes, previous/next controls and desktop arrow keys; Escape or Close restores focus to the original card.
- Animal habitat filters, continuous number browsing from 1–30, random exploration, device-local favorites and separate manual Mandarin/English playback buttons. Opening and switching cards stay silent.
- Each of 253 illustrations has a 640 × 560 thumbnail and a native 2048 × 1792 full-screen WebP with the two previous and two next images preloaded in the viewer; numbers include matching object counts and letters include familiar associations.
- iPhone Home Screen installation, bounded offline use and a header link to the Hexly project archive.

| Category | Cards |
| --- | ---: |
| Animal friends | 29 |
| Numbers | 30 |
| Letters | 26 |
| Chinese characters | 20 |
| Everyday phrases | 29 |
| Weather and nature | 25 |
| Everyday objects | 31 |
| Fruit | 26 |
| Transport | 10 |
| Vegetables | 9 |
| Table food | 10 |
| Places to visit | 8 |

## Usage

Open [zoo.hexly.ai](https://zoo.hexly.ai), choose a category and tap a card. Share sessions of around 5–10 minutes, then point out and find the subjects in the real world together.

In Safari on iPhone, tap Share → Add to Home Screen to launch **小小动物岛** independently. After an online visit, the app shell and at most 48 recently viewed images can work offline; uncached pictures still need a connection. Audio and the health endpoint bypass offline caching, so offline narration is not guaranteed. iOS may evict browser storage. Close all island windows and reopen to activate a downloaded update.

The 77 additions have owner-approved art/copy and all 154 full bilingual Edge recordings generated and integrated under generation/publication authorization, not sentence-by-sentence listening or pronunciation approval; the original 176 cards retain their exact content and media URLs. Dev/build selects completed Gemini clips ahead of Edge without provider calls. No speech timer is installed. The root coordinator owns separately authorized generation, versions and deployment. See [the expansion record](03-content-expansion.md) and [AGENTS.md](../AGENTS.md) for current scope and preservation instructions.

## Development

Use Node.js 22.18+ or 24+ and npm. On the maintainer's machine, follow the approved package-registry policy.

```sh
npm ci
npm run dev
npm run check
npm run build
```

Development listens on `127.0.0.1:7058`; local Caddy supplies `https://zoo.dev.hexly.ai`. `npm run preview` serves the production build on the same port, so stop development first. The service worker is registered only in production builds; use production preview on the reserved test port for offline checks rather than caching the development server.

```sh
npm run preview -- --port 17058
```

Deploy with repository-local Wrangler and the operator's existing Cloudflare authentication:

```sh
npm run deploy
```

`wrangler.jsonc` binds the assets-only Worker `zoo` to `zoo.hexly.ai`. There is no application backend, database, binding or runtime secret. This repository has not migrated to `cf` project configuration; the installed CLI's `cf pages deploy` is a legacy-command stub, not a replacement for this project's Wrangler Worker deployment.

The build emits anonymous `GET /api/live` JSON containing `status: "ok"`, the top-level `package.json` `version` and the build-time Git HEAD as `revision`, served with `Cache-Control: no-store`. It proves static deployment availability and build identity only, not the health of speech providers or other external services. Release builds must use committed source so the revision identifies the deployed source.

## Tests

```sh
npm run check
npm run build
node scripts/check-pwa.mjs
node --experimental-strip-types scripts/check-audio-player.ts
python3 -B scripts/check-audio-schedule.py
python3 -B scripts/check-edge-expansion.py
python3 -B scripts/generate-edge-audio.py --check --expansion
npm run check:live
```

Content checks verify category counts, unique IDs, image existence and Chinese number readings; the build checks TypeScript. PWA checks cover app-shell files, the image-cache limit, offline entry, missing-image hints and audio/health cache bypasses. Health checks own a temporary local Worker without an account or remote bindings on ephemeral local ports, checking GET/HEAD, JSON, version, revision and no-store behavior. The installed workerd supports compatibility dates through 2026-10-08, which the local test configuration explicitly uses; production retains 2026-10-09 and requires separate online acceptance.

Existing Chromium smoke checks cover category selection, filters, favorites persistence, full-screen navigation and closing, number 30, parent information and 320/390/768/1440 px layouts. Chromium also verifies offline reopening and images. WebKit checks online mobile layout and navigation, but its automated offline reload returned an internal error. Physical iPhone Home Screen, status-bar and offline behavior, as well as actual iOS/Android touch and pronunciation quality, still need device verification. These are basic checks, not a comprehensive quality audit.

## Stack

- React, TypeScript and Vite: static application, interaction and builds.
- [animal-island-ui](https://github.com/guokaigdg/animal-island-ui): controls and base styling; `naive-icons`: UI icons.
- Native Service Worker, Web App Manifest and static MP3 narration: bounded offline use, Home Screen installation and narration.
- Cloudflare Workers Static Assets: static hosting and the build health document.

## Documentation

- [Maintenance contract and local speech jobs](../AGENTS.md)
- [HD illustration originals and export workflow](../design/art/hd/README.md)
- [Hexly project archive](https://hexly.ai/projects/zoo)

The original 176 illustrations in `public/art/hd/` and 77 additions in `public/art/expansion/` each have full-size and thumbnail delivery files; the initial page does not download the entire collection. `public/art/hero.webp` preserves the original hero; prior atlas-resolution assets are archived in `design/art/legacy-delivery/`. `design/art/` retains original PNG generations, prompts, row-major subject orders, processing scripts and contact sheets. Card illustrations were made with Azure OpenAI `gpt-image-2.5-sunburst` through the Workflow image-generation process. The UI library and icon package retain MIT notices in their distributions.

## License

[MIT](../LICENSE).
