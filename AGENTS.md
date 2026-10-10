# Zoo

## Project

- Chinese picture-learning website for children aged 1.5-3, used with an adult.
- React, TypeScript and Vite. `animal-island-ui` provides controls and styling; `naive-icons` provides UI icons.
- Static application: no authentication, database, tracking or application API.
- Build-time `GET /api/live` is a static deployment-health document, not an application backend. `scripts/build-live.mjs` emits `status: "ok"`, top-level package version and Git HEAD revision after Vite; `_headers` serves JSON with `Cache-Control: no-store`. It does not probe speech services. Build releases from committed source; preserve anonymous access and service-worker cache bypass.
- `src/content.ts` owns 246 cards across eight categories. Numbers cover 1-100; letters cover A-Z; other categories have 20 cards each.
- `src/useIsland.ts` owns interaction state, device-local favorites and playback. `src/App.tsx` renders the views.
- `src/PictureViewer.tsx` uses a native modal dialog for full-viewport browsing, focus containment and restoration. It supports pointer swipes and arrow keys; the ordinary library Modal remains only for parent information.
- Keep card/viewer illustration surfaces on `--zoo-art-paper`. Card assets have a matching normalized background; do not restore multiply blending, colored letterboxing or nested pill geometry on image cards.
- Preserve Chinese product copy and correct pinyin. Do not present advanced numbers or literacy as developmental requirements.
- Images in `public/art/` are optimized delivery assets. Preserve generation originals, prompts and exact subject ordering under `design/art/`.
- All 120 illustrated cards use reference-guided GPT Image 2.5 redraws: 640 x 560 thumbnails and native 2048 x 1792 full-screen WebP via `Picture.imageLarge`. The owner approved the first three samples and authorized the rest on 2026-10-10. Preserve native outputs, exact references, prompts and request records under `design/art/hd/`. Run `uv run --with pillow python design/art/hd/process.py` to export missing derivatives; `--check` verifies all 120 records without writes. See `design/art/hd/README.md`. Numbers and letters remain native text; the hero is unchanged.

## Commands

- `npm run dev`: Vite on loopback port 7058, strict port, Caddy hostname allowed.
- `npm run build`: TypeScript check and production build to `dist/`.
- `npm run check`: minimal content counts, unique IDs, image existence and number-reading checks.
- `npm run check:live`: requires a current build; owns a temporary, local-only Worker with ephemeral HTTP/inspector ports and no account, routes or remote bindings. Verifies actual GET/HEAD JSON, version, revision and cache headers, then removes its own state. The installed workerd supports dates through 2026-10-08; the test fixture uses that date without changing production 2026-10-09, whose behavior must be verified after deployment.
- `npm run preview`: production output on loopback 7058; stop the development server first.
- `npm run deploy`: build and deploy the static Worker using repository-local Wrangler.
- Follow the machine's registry policy when installing dependencies.

## PWA And iOS

- Document title, manifest name/short name and Apple standalone title are exactly `小小动物岛` (five Chinese characters). `public/manifest.webmanifest` uses stable `/` identity, root scope/start URL and standalone display without an orientation lock.
- Icons derive from the approved physical-tool identity: transparent `logo.png` and square `public/assets/brand/icon.png`; `icon-rounded.png` is the README/display derivative only. `node scripts/generate-icons.mjs` uses the already-installed Sharp transitive package to create `public/favicon.png`, opaque 180 px Apple Touch Icon, 192/512 px regular icons and a padded 512 px maskable icon. Do not pre-round Apple or maskable PNG corners; the OS applies its mask. No generation credentials are involved in icon derivation. The previous bear SVG is preserved in the Hexly identity archive, not an active fallback.
- Production builds run `scripts/build-pwa.mjs` after Vite to emit `dist/sw.js`, versioned by all build bytes and worker code. The native worker precaches the root HTML, bundled JS/CSS/fonts and install metadata only, never the full illustration/audio collection. Development does not register a worker. Use `vite preview` on reserved port 17058 for local offline tests rather than caching the development server.
- The worker keeps one matching app-shell version until all old windows close; do not add unconditional `skipWaiting`, mix new HTML with old chunks, or reload mid-session. New builds change the worker version. Worker activation deletes only Zoo-owned obsolete caches. `/sw.js` and the manifest revalidate via `_headers`.
- At most 48 successfully viewed image responses are cached on demand. Offline uncached images display a Chinese connection hint. Audio, `/api/` and Range requests bypass the worker; health files never enter the precache. Do not claim offline speech. Browser storage may be evicted, especially on iOS. No cache contains credentials, and there is no analytics or background sync.
- Preserve viewport zoom and safe-area padding on the main page and viewer. Speech stops on page hide/backgrounding. Parent information explains Safari Share > Add to Home Screen and offline/update limitations.
- Validation: `npm run check`, `npm run build`, then `node scripts/check-pwa.mjs`. Isolated Chromium covers offline reopening/images; WebKit covers online mobile layout and navigation. WebKit's automation offline reload returned an internal error; physical iPhone Home Screen/status-bar and offline verification remain outstanding.

## Environments

- Local browser URL: `https://zoo.dev.hexly.ai`, proxied to `127.0.0.1:7058`.
- Reserved browser test ports: 17058 / 27058. The health harness selects ephemeral loopback ports instead of taking over an existing preview.
- Production URL: `https://zoo.hexly.ai`; Worker `zoo`; configuration `wrangler.jsonc`.
- This repository has not migrated to `cf` project configuration. Use Wrangler for deployment; `cf` resource reads are supported.
- User requested basic validation only. Build/content checks and Chromium responsive smoke checks are not evidence of a full 6DQ quality audit.
- Recorded speech generation is in progress: 98 of 246 clips are archived. The provider's daily quota blocked completion on 2026-10-10. The application still uses browser/OS speech until the complete manifest exists and recorded playback is integrated. Do not claim the replacement is live yet. Headless playback checks do not establish pronunciation accuracy of every generated sentence.

## Recorded Speech Generation

- Approved provider/model: Google Gemini Interactions API, `gemini-3.8-flash-tts`.
- Approved voice: `Sulafat`, warm adult female. The owner approved the faster second preview take on 2026-10-10.
- Mandarin direction: standard Mainland Putonghua, no Taiwanese/Hong Kong/Cantonese accent, precise tones, natural neutral tones, affectionate but not breathy or babyish. Natural conversational delivery around four Chinese syllables per second, connected speech, no vowel stretching, 150-200 ms pause after the name. Preserve the exact approved style in `scripts/generate-audio.py`; do not use playback speed changes to imitate it.
- `src/audio.ts` defines the narration text from `src/content.ts`: picture/phrase cards read their name followed by the description; numbers read their Chinese number name; letters read only their American English alphabet name, not phonics. Every card uses the same recorded clip for opening and replay.
- The generator reads the Gemini credential privately from `~/.config/his.fm/config.json`, field `speechKeys.gemini`. This is a local configuration reference, NOT a credential value. Never print, copy, commit, expose in command arguments, or put the Key in `AGENTS.md`, prompts, generated metadata, browser code, or public files. Do not modify His.fm settings. Normal builds and playback need no credentials or provider access.
- Requirements: Node.js with TypeScript stripping, Python 3 standard library, and `ffmpeg` on PATH. No extra Python packages are needed.
- Generate/resume: `python3 scripts/generate-audio.py` from the repository. It derives all 246 transcripts from the source, makes sequential requests with at least twenty seconds between starts, reuses the three exact approved v2 WAVs, and stores completed items immediately. There is no within-run retry or model fallback. Inspect HTTP 429 details: this credential reported a Tier 1 limit of 100 requests per day; wait for the stated quota reset, not merely one minute. An exclusive filesystem lock prevents overlapping generation processes. Do not upgrade billing or rotate credentials to avoid limits.
- Validate without keys, network, or writes: `python3 scripts/generate-audio.py --check`. Then run `npm run check` and `npm run build`.
- Archives: `design/audio/<card-id>.wav` retains unmodified provider output; adjacent JSON records model, voice, exact text/style, interaction ID, duration, source and WAV/MP3 SHA-256. It contains no Key. Playback: `public/audio/<card-id>.mp3`, mono 24 kHz, 96 kbps, converted by ffmpeg without speed changes, trimming or effects. `src/audio-manifest.json` maps all IDs to content-versioned playback URLs and is written only after the complete batch succeeds.
- Resume validates the recorded request and file hashes. If card text/model/style changes, first preserve that card's old WAV/JSON/MP3 in a dated archive outside the active `design/audio` and `public/audio` directories, then rerun. Do not delete provenance or blindly overwrite a completed take. A changed approved-preview transcript must not silently reuse the old approved recording.
- Browser verification: open a card, replay, rapidly switch cards, close, and toggle automatic audio. Only one recording may play; interrupted requests must not show stale errors. Show a useful playback failure message, never silently fall back to system TTS. Verify at least one card from each category, number 100, and an English letter.
- Audio approval does not authorize a production deployment. Deploy only when requested.

## Local Speech Schedule

- The owner authorized timed completion of the remaining Gemini recordings on 2026-10-10. Native macOS LaunchAgent `ai.hexly.zoo.audio` runs `scripts/generate-audio.py --scheduled` daily at 08:30 in the machine's timezone (currently Asia/Shanghai). The earlier provider reset countdown indicated roughly 08:00; 08:30 adds margin but is not a guaranteed provider reset contract. Other His.fm usage shares quota.
- Each scheduled run generates at most 90 missing clips, validates existing ones, stops immediately on provider errors, and waits at least 23 hours before another scheduled attempt. All 246 matching files are required before writing `src/audio-manifest.json`. Once complete, later timer invocations exit without provider access. No system-voice replacement, Git commit, push or deployment occurs automatically; review and integrate the completed manifest separately.
- State, exclusive lock and stdout/stderr logs live under ignored `artifacts/audio-schedule/`. `state.json` records `waiting`, `failed` or `complete`, timestamps and the next allowed run time; it contains no credentials. Do not delete its cooldown to force extra requests. Manual non-scheduled runs also lock but do not use this daily budget; avoid them while the timer is active.
- Machine-specific plist source: `scripts/ai.hexly.zoo.audio.plist`; installed copy: `~/Library/LaunchAgents/ai.hexly.zoo.audio.plist`. It contains only paths and calendar settings, never a Key. The script reads the existing private His.fm credential at execution time. On another machine update paths before installing.
- Install: create `artifacts/audio-schedule/`, copy the plist into `~/Library/LaunchAgents/`, then `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/ai.hexly.zoo.audio.plist`. Inspect: `launchctl print gui/$(id -u)/ai.hexly.zoo.audio`. Disable: `launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/ai.hexly.zoo.audio.plist`.
- The user must be logged in. A calendar event missed during sleep is coalesced on wake; shutdown/logged-out time is not guaranteed to be replayed. The schedule follows the machine timezone if it changes. There is no keep-alive restart loop or immediate run on installation.
- Safe schedule check: `python3 scripts/check-audio-schedule.py` uses temporary files and mocked generation, with no API calls. Full file validation after completion remains `python3 scripts/generate-audio.py --check`.
