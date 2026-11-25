# Zoo

Static Chinese picture-learning web app (React, TypeScript, Vite, `animal-island-ui`, `naive-icons`) for ages 1.5–3 with an adult, hosted on Cloudflare Workers Static Assets with a native Swift `WKWebView` wrapper in `macos/`.
Docs: [README.md](README.md) · [Docs Index](docs/README.md) · [Media & Batch History](docs/05-media-pipeline-and-batch-history.md) · [CI/CD](docs/ci-cd.md) · [Retrospective](Retrospective.md)

## Commands

Run from root with Node.js 26.12.1 (or 22.18+ with TypeScript stripping), Python 3, and `ffmpeg`. Builds, checks, and playback require no API credentials.

```sh
npm ci
npm run dev                  # https://zoo.dev.hexly.ai -> 127.0.0.1:7058
npm run build                # build-media, tsc --noEmit, vite build, live, pwa
npm run build:mac            # web build + Swift WKWebView bundle in dist-mac/
npm run check                # content inventory, IDs, images, number labels
npm run lint                 # S2: Biome lint and format check
npm run check:live           # ephemeral local Worker GET/HEAD /api/live check
node scripts/check-pwa.mjs   # service worker precache and bypass verification
node --experimental-strip-types scripts/check-audio-player.ts
python3 -B scripts/check-audio-schedule.py
python3 -B scripts/generate-edge-audio.py --check
python3 -B scripts/generate-audio.py --check --bilingual-day
npm run preview              # dist/ on 127.0.0.1:7058 (stop dev first)
npm run deploy               # build + Wrangler deploy (authorized only)
```

## Invariants

- Static site with no auth, DB, tracking, or backend API. Build-time `GET /api/live` serves `no-store` health JSON from committed source; keep it anonymous and bypassed by the service worker.
- Stay a single flat repo: root JS/TS web app plus dependency-free Swift `WKWebView` wrapper in `macos/` consuming `dist/`. Do not add workspaces or duplicate web sources without a second JS/TS app.
- `src/content.ts` assembles 360 cards across 15 categories (numbers 1–30 flat, letters A–Z). Preserve Chinese copy/pinyin; never present numbers, literacy, colors, shapes, or family as developmental requirements.
- Keep illustration surfaces on `--zoo-art-paper` (no multiply blending, colored letterboxing, or nested pills). `src/PictureViewer.tsx` uses native `<dialog>` and preloads at most 2 prev + 2 next images.
- Playback pills stay 64 px single-line (wrap whole button, never text); subtitle reveal must not shift layout and renders plain text only. Random start uses a single-session Fisher-Yates shuffle.
- App title, manifest name, and Apple standalone title are exactly `小小动物岛`. `dist/sw.js` precaches app shell only (never full art/audio), caps on-demand images at 48, and bypasses audio, `/api/`, and `Range`.
- Never add unconditional `skipWaiting` or reload mid-session; keep one shell version until old windows close. Never pre-round Apple 180 px or 512 px maskable icons; preserve viewport zoom and safe-area padding.
- Playback uses static MP3s only (never browser/OS TTS); opening/switching stays silent and page hide stops speech. `scripts/build-media.mjs` picks Gemini over Edge offline; Edge serves only 86 number/letter clips.
- Preserve all `design/art/`, `design/audio/`, `design/audio-edge/`, and `artifacts/audio-schedule/` provenance/state. Archive old WAV/JSON/MP3 before regenerating changed text; never regenerate the 86 Edge files.
- Read `GEMINI_API_KEY` only from gitignored `.env`; never print, commit, or expose it. Never call paid speech/image APIs, retry errors, reset budget/cooldown ledgers, or reinstall a speech timer without approval.
- Audio/art approval never authorizes deployment; deploy via Wrangler only when authorized (not on `cf`). Full media SOPs, UI specs, and batch history live in [doc 05](docs/05-media-pipeline-and-batch-history.md).

## Quality & Local Gates

Follows `system1-quality`; CI slot definitions and pinned `base-ci` revision live in [.github/workflows/quality-slots.yml](.github/workflows/quality-slots.yml) (`quality / Z1: Gate` required on `main` and verified by `.github/workflows/deploy.yml`). Status vocabulary: `enforced`, `planned`, `manual`, `N/A`.

- **Exceptions / gaps**: `L2 Runtime` (static Worker), `L3 Integration` (no backend API), and `L4 E2E` (no CI Playwright suite) are `N/A`. `P1 Package` (`wrangler deploy --dry-run`) and `S2 Lint` (`npm run lint`) are `enforced`.
- **Verification scope**: `L1 Unit` is `enforced` via repo check scripts without a coverage threshold; physical iPhone PWA/offline and listening pronunciation reviews remain `manual`.
- **Local hooks**: none configured in repo; run `npm run check`, `npm run build`, `node scripts/check-pwa.mjs`, and `npm run check:live` manually (`manual`) before pushing.

## Resources & Isolation

| Lane  | Endpoint / State                                            | Boundary                                                                                        |
| ----- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Dev   | `https://zoo.dev.hexly.ai` -> `127.0.0.1:7058`              | Daily Vite dev server; stop before `npm run preview` on `7058`; no SW registered                |
| Tests | Preview `17058` / `27058`; ephemeral ports for `check:live` | Offline SW tests use `vite preview --port 17058`; local `workerd` uses compat date `2026-10-08` |
| Prod  | `https://zoo.hexly.ai` (Worker `zoo`, `wrangler.jsonc`)     | Read-only checks unless deploy authorized; compat date `2026-10-09` verified post-deploy        |

## Retrospective

Record incident narratives in [Retrospective.md](Retrospective.md); promote recurring project constraints to `Invariants` above and enforceable safeguards to tests or hooks.
