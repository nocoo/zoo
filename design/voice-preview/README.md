# Voice Preview

Provider: Google Gemini Interactions API, `gemini-3.8-flash-tts`, voice `Sulafat`.

The generator reads only the existing Gemini credential from the private user-level His.fm configuration. Credentials are never copied into this repository. Text, delivery instructions, interaction IDs and durations are preserved in the per-sample JSON metadata.

## Takes

- First take: three warm female Mandarin samples, requested slow delivery. The owner found this too slow.
- `v2`: newly synthesized with more connected speech and shorter pauses, targeting roughly 25% faster delivery. No playback-rate changes, time stretching or truncation.

| Sample | First take | v2 |
| --- | ---: | ---: |
| Lion | 8.28 s | 6.56 s |
| Panda | 7.64 s | 5.80 s |
| Rabbit | 8.56 s | 6.76 s |

The local comparison page is `/voice-preview/`. The owner approved the second take on 2026-10-10 and authorized generating all card recordings with this voice and pace. Full-batch generation and safe rerun instructions are maintained in the root `AGENTS.md`. The original preview recordings remain unchanged; the first three full-batch entries reuse the exact approved second-take WAVs. No production deployment is implied by voice approval. WAV decoding and real browser playback were verified, not accent quality or verbatim acoustic transcription.
