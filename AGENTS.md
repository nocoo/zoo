# Zoo

## Project

- Chinese picture-learning website for children aged 1.5-3, used with an adult.
- React, TypeScript and Vite. `animal-island-ui` provides controls and styling; `naive-icons` provides UI icons.
- Static application: no authentication, database, tracking or application API.
- `src/content.ts` owns 246 cards across eight categories. Numbers cover 1-100; letters cover A-Z; other categories have 20 cards each.
- `src/useIsland.ts` owns interaction state, device-local favorites and playback. `src/App.tsx` renders the views.
- `src/PictureViewer.tsx` uses a native modal dialog for full-viewport browsing, focus containment and restoration. It supports pointer swipes and arrow keys; the ordinary library Modal remains only for parent information.
- Keep card/viewer illustration surfaces on `--zoo-art-paper`. Card assets have a matching normalized background; do not restore multiply blending, colored letterboxing or nested pill geometry on image cards.
- Preserve Chinese product copy and correct pinyin. Do not present advanced numbers or literacy as developmental requirements.
- Images in `public/art/` are optimized delivery assets. Preserve generation originals, prompts and exact subject ordering under `design/art/`.
- The owner approved the first three HD animals and authorized the remaining 117 redraws on 2026-10-10. The batch is in progress; the application still uses only the three approved HD cards until the full batch is verified. Use 640 x 560 thumbnails and native 2048 x 1792 full-screen WebP via `Picture.imageLarge`. Preserve reference-guided GPT Image 2.5 outputs under `design/art/hd/`; run `uv run --with pillow python design/art/hd/process.py` to reproduce completed delivery assets. See `design/art/hd/README.md`. Do not claim full HD coverage before verification.

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
- Recorded speech generation is in progress: 98 of 246 clips are archived. The provider's daily quota blocked completion on 2026-10-10. The application still uses browser/OS speech until the complete manifest exists and recorded playback is integrated. Do not claim the replacement is live yet. Headless playback checks do not establish pronunciation accuracy of every generated sentence.

## Recorded Speech Generation

- Approved provider/model: Google Gemini Interactions API, `gemini-3.8-flash-tts`.
- Approved voice: `Sulafat`, warm adult female. The owner approved the faster second preview take on 2026-10-10.
- Mandarin direction: standard Mainland Putonghua, no Taiwanese/Hong Kong/Cantonese accent, precise tones, natural neutral tones, affectionate but not breathy or babyish. Natural conversational delivery around four Chinese syllables per second, connected speech, no vowel stretching, 150-200 ms pause after the name. Preserve the exact approved style in `scripts/generate-audio.py`; do not use playback speed changes to imitate it.
- `src/audio.ts` defines the narration text from `src/content.ts`: picture/phrase cards read their name followed by the description; numbers read their Chinese number name; letters read only their American English alphabet name, not phonics. Every card uses the same recorded clip for opening and replay.
- The generator reads the Gemini credential privately from `~/.config/his.fm/config.json`, field `speechKeys.gemini`. This is a local configuration reference, NOT a credential value. Never print, copy, commit, expose in command arguments, or put the Key in `AGENTS.md`, prompts, generated metadata, browser code, or public files. Do not modify His.fm settings. Normal builds and playback need no credentials or provider access.
- Requirements: Node.js with TypeScript stripping, Python 3 standard library, and `ffmpeg` on PATH. No extra Python packages are needed.
- Generate/resume: `python3 scripts/generate-audio.py` from the repository. It derives all 246 transcripts from the source, uses at most four concurrent requests with at least fifteen seconds between provider request starts, reuses the three exact approved v2 WAVs, and stores completed items immediately. There is no automatic retry or model fallback. Inspect HTTP 429 details: this credential reported a Tier 1 limit of 100 requests per day; wait for the stated quota reset, not merely one minute. A complete batch requires multiple quota windows if this limit remains. Do not launch simultaneous generator processes or upgrade billing without authorization.
- Validate without keys, network, or writes: `python3 scripts/generate-audio.py --check`. Then run `npm run check` and `npm run build`.
- Archives: `design/audio/<card-id>.wav` retains unmodified provider output; adjacent JSON records model, voice, exact text/style, interaction ID, duration, source and WAV/MP3 SHA-256. It contains no Key. Playback: `public/audio/<card-id>.mp3`, mono 24 kHz, 96 kbps, converted by ffmpeg without speed changes, trimming or effects. `src/audio-manifest.json` maps all IDs to content-versioned playback URLs and is written only after the complete batch succeeds.
- Resume validates the recorded request and file hashes. If card text/model/style changes, first preserve that card's old WAV/JSON/MP3 in a dated archive outside the active `design/audio` and `public/audio` directories, then rerun. Do not delete provenance or blindly overwrite a completed take. A changed approved-preview transcript must not silently reuse the old approved recording.
- Browser verification: open a card, replay, rapidly switch cards, close, and toggle automatic audio. Only one recording may play; interrupted requests must not show stale errors. Show a useful playback failure message, never silently fall back to system TTS. Verify at least one card from each category, number 100, and an English letter.
- Audio approval does not authorize a production deployment. Deploy only when requested.
