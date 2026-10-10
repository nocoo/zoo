# Changelog

## v1.1.0 - 2026-10-10

- Add English labels and separate Mandarin/English playback controls across all 246 cards, with pinyin and Chinese number names in the immersive viewer.
- Replace browser speech synthesis with static MP3 playback. Preserve all 99 completed Gemini recordings and supply 121 temporary Mandarin and 246 English Edge recordings without changing the daily Gemini schedule.
- Keep opening and switching cards silent; stop active narration on navigation, closing or backgrounding.
- Preload the two previous and two next full-size illustrations in the current collection, and version image URLs by content with one-year browser/CDN cache headers.
- Validate recording transcripts and checksums during builds, exclude temporary audio from PWA precaching, and document local generation and Gemini-first selection.

## v1.0.1 - 2026-10-10

- Adopt the approved Zoo picture-card identity across the header, favicon, Apple Touch Icon and PWA icons while preserving existing illustrations and offline behavior.
- Add the Hexly project archive entry and complete Chinese and English documentation.
- Publish build-generated deployment health at `/api/live` with package version, source revision and `Cache-Control: no-store`; exclude health requests from service-worker caching.
- Add isolated local Worker health checks alongside existing content and PWA checks.
