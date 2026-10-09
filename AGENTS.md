# Zoo

## Project

- Chinese picture-learning website for children aged 1.5-3, used with an adult.
- React, TypeScript and Vite. `animal-island-ui` provides controls and styling; `naive-icons` provides UI icons.
- Static application: no authentication, database, tracking or application API.
- `src/content.ts` owns 246 cards across eight categories. Numbers cover 1-100; letters cover A-Z; other categories have 20 cards each.
- `src/useIsland.ts` owns interaction state, device-local favorites and browser speech synthesis. `src/App.tsx` renders the views.
- Preserve Chinese product copy and correct pinyin. Do not present advanced numbers or literacy as developmental requirements.
- Images in `public/art/` are optimized delivery assets. Preserve generation originals, prompts and exact subject ordering under `design/art/`.

## Commands

- `npm run dev`: Vite on loopback port 7058, strict port, Caddy hostname allowed.
- `npm run build`: TypeScript check and production build to `dist/`.
- `npm run check`: minimal content counts, unique IDs, image existence and number-reading checks.
- `npm run preview`: production output on loopback 7058; stop the development server first.
- `npm run deploy`: build and deploy the static Worker using repository-local Wrangler.
- Follow the machine's registry policy when installing dependencies.

## Environments

- Local browser URL: `https://zoo.dev.hexly.ai`, proxied to `127.0.0.1:7058`.
- Reserved test ports: 17058 / 27058; no test servers currently configured.
- Production URL: `https://zoo.hexly.ai`; Worker `zoo`; configuration `wrangler.jsonc`.
- This repository has not migrated to `cf` project configuration. Use Wrangler for deployment; `cf` resource reads are supported.
- User requested basic validation only. Build/content checks and Chromium responsive smoke checks are not evidence of a full 6DQ quality audit.
- Speech output depends on browser and OS voices. Headless UI checks do not establish audible voice quality on real devices.
