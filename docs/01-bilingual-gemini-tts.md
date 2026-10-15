# Bilingual Gemini Narration

Status: 2026-10-15 integration, before the newly authorized Gemini run. Eligible coverage is 240/394; the 77 additions already have 154 full bilingual Edge clips. The owner approved expansion copy/art and authorized audio generation/publication as v1.4.0 (not sentence-by-sentence listening or pronunciation approval), then only these 154 Gemini replacements via `--bilingual-day --until-provider-error` after that deployment, Mandarin first, stopping at the first quota/provider/file error or queue completion, followed by v1.4.1. Root owns providers, versions and releases and records actual results. No timer, retries or number/alphabet generation are authorized. The earlier expansion hold is superseded only for this bounded scope.

## Reading Contract

[Review bilingual copy and local status](02-bilingual-copy.md). `src/content.ts` assembles all 253 cards, including the 77 approved additions from `src/expansion.ts`. Existing Chinese names, pinyin, descriptions, English labels and the approved lion explanation are unchanged.

- 197 picture/character/phrase cards: each language reads the name plus the full explanation.
- 30 numbers: Mandarin retains number-name-only narration; English targets name plus counting explanation. Both languages are excluded from current generation.
- 26 letters: one American English alphabet-name clip is shared by both playback entries. Descriptions are editorial, not narration. Letters are excluded from current generation.
- Total full-coverage target: 480 unique recordings, not 506 (letters share clips). Current eligible scope: 394 recordings for 197 non-number/non-alphabet cards.
- Captions always match the selected recording. Original Edge English clips retain name-only narration; the 77 expansion English clips already include full explanations. Gemini has priority independently in both languages.

## Verified Local Inventory

Updated for 2026-10-15 integration, before replacement generation. Completed recordings match their target transcript, model, Sulafat voice, style and WAV/MP3 hashes. `src/media.json` selects these local recordings.

| Category | Mandarin complete | Mandarin pending | English complete | English pending | Shared alphabet pending |
| --- | ---: | ---: | ---: | ---: | ---: |
| Animals | 20 | 9 | 20 | 9 | 0 |
| Fruit | 20 | 6 | 20 | 6 | 0 |
| Weather | 20 | 5 | 20 | 5 | 0 |
| Objects | 20 | 11 | 20 | 11 | 0 |
| Chinese characters | 20 | 0 | 20 | 0 | 0 |
| Phrases | 20 | 9 | 20 | 9 | 0 |
| Transport | 0 | 10 | 0 | 10 | 0 |
| Vegetables | 0 | 9 | 0 | 9 | 0 |
| Food | 0 | 10 | 0 | 10 | 0 |
| Places | 0 | 8 | 0 | 8 | 0 |
| Numbers 1-30 (excluded) | 0 | 30 | 0 | 30 | 0 |
| Alphabet A-Z (excluded) | 0 | 0 | 0 | 0 | 26 |
| Total | 120 | 107 | 120 | 107 | 26 |

240/480 unique Gemini targets are complete locally. Of the 240 missing Gemini targets, 154 are the newly eligible expansion recordings and 86 remain excluded number/alphabet recordings. Every card already has both playback URLs; pending Gemini is not missing audio.

These inventory numbers describe validated local files, not production deployment. The v1.3.0 release includes the forty new English recordings; exact deployment evidence comes from its release-commit CI and online verification.

## Completed On 2026-10-14

The owner confirmed the original remaining scope: `en/hanzi-01` through `en/hanzi-20`, then `en/phrases-01` through `en/phrases-20`. The standard `--bilingual-day` mode completed all 40 requests within the conservative daily cap, with no provider errors, retries, cap override, copy/style changes or number/alphabet requests.

All 1,349 pre-existing audio/archive files remain byte-identical. Exactly forty WAV/JSON/MP3 sets were added, with original provider output, request metadata and hashes preserved. Every new MP3 decoded fully with FFmpeg. The offline eligible inventory check reports 240/240 complete and zero pending. The local ledger records 40 attempts for 2026-10-14, leaving 50 unused; this is not permission to generate more or evidence of the provider's remaining quota. Automated validation does not establish pronunciation accuracy of every sentence.

## Completed On 2026-10-12

1. Approved lion English sample: one request, retained unchanged.
2. Five-clip Mandarin review: `hanzi-19`, `phrases-01` through `phrases-04`. The owner listened and approved before continuation.
3. Daily continuation: 84 successful requests, with no retries or provider errors:

| Scope | IDs | New clips |
| --- | --- | ---: |
| Mandarin phrases | phrases-05 through phrases-20 | 16 |
| English animals | animals-02 through animals-20 | 19 |
| English fruit | fruits-01 through fruits-20 | 20 |
| English weather | weather-01 through weather-20 | 20 |
| English objects | objects-01 through objects-09 | 9 |
| Total continuation | Mandarin first, then English | 84 |

The continuation preserved all 1,050 pre-existing audio/archive files byte-for-byte and added exactly 84 WAV/JSON/MP3 sets. Every new MP3 decoded fully with FFmpeg. Content and production-build checks passed. Local browser checks sample every newly generated category, silent navigation, exact language URLs and full captions; automated checks do not establish pronunciation quality of every sentence.

## Provider-Limited Continuation

After explicit approval to continue until an API error, `--bilingual-day --until-provider-error` generated objects-10 through objects-20 in English (11 clips), then stopped at the first error: HTTP 429 on en/hanzi-01. No retry, key change, quota change or number/alphabet request occurred. All 1,302 pre-existing audio files remained byte-identical; each of the eleven new MP3s decoded fully.

The local ledger records 102 attempts on 2026-10-12: six seeded successes, 84 successful daily-batch requests, then eleven more successes and one rejected request. This differs from the provider's reported 100/day limit; local-day accounting is not the provider quota window and the exact discrepancy is not established. Do not rewrite counts to force agreement. The reported retry deadline is approximately 2026-10-13 08:00 Asia/Shanghai; it is recorded in the preserved local cooldown state, not scheduled for automatic execution.

The explicit continuation flag is allowed only with the number/alphabet-excluding bilingual queue, keeps counting all attempts with an approval marker, stops on any error or queue exhaustion, and never changes the default 90-attempt cap. Do not use it again without fresh approval.

## Remaining Scope

Only the 154 new targets are pending in the authorized queue: 77 Mandarin, then 77 English. The 30 Mandarin number recordings, 30 English number recordings and 26 shared alphabet recordings remain excluded and use Edge playback. Do not start them, reinstall a timer, retry a stopped run or regenerate any completed recording without fresh explicit approval.

## Execution And Budget

- Approved provider/model: Gemini Interactions API, `gemini-3.8-flash-tts`; voice: `Sulafat`. Preserve the approved faster Mainland Mandarin style and natural American English explanation style in `scripts/generate-audio.py`.
- The root-owned 2026-10-15 continuation, only after v1.4.0 deployment: `python3 scripts/generate-audio.py --bilingual-day --until-provider-error`. The default `--bilingual-day` retains its 90-attempt cap. Both construct all eligible Mandarin jobs before English, in category order animals, fruits, weather, objects, hanzi, phrases, transport, vegetables, food, places. Existing matching recordings are validated without rewriting them; only pending jobs use the provider. Number and alphabet jobs are never included.
- Offline inventory/full authorized queue check: `python3 scripts/generate-audio.py --check --bilingual-day --until-provider-error`. No keys, network, writes or full-coverage requirement; missing eligible jobs are reported as pending. This is not a pronunciation review.
- Generation is sequential, with at least 20 seconds between request starts, under the existing exclusive filesystem lock. Each result is saved immediately. Any provider/file error stops the run; there is no automatic retry, fallback model, key rotation or billing change.
- `artifacts/audio-schedule/request-budget.json` records a conservative local-calendar-day maximum of 90 attempts across all generator modes. Each request is reserved before network access, so failed attempts count. The first entry for a date seeds known successes from that day's generated WAV modification dates; on 2026-10-12 six were verified before the ledger began. Preserve the ledger and old cooldown history.
- This ledger is not a provider quota meter: historical errors reported 100 requests/day on Tier 1, shared with His.fm. File timestamps cannot reveal other-device/shared usage or failed requests before the ledger existed. The local date boundary is not a provider reset contract. Respect actual provider errors/reset instructions.
- The daily mode does not use the obsolete all-catalogue completion flag or write a partial `src/audio-manifest.json`. `scripts/build-media.mjs` selects exact-transcript, hash-validated Gemini files independently by language and writes `src/media.json` for dev/build. Builds never invoke a speech provider.
- Originals remain in `design/audio/<id>.wav|json`, with English under `design/audio/en/`; MP3 delivery follows the same structure in `public/audio/`. Keep all Edge files and prior approved takes. Archive old WAV/JSON/MP3 together before any separately authorized changed-text replacement.
- Credentials remain private in the existing His.fm configuration. Never print or copy the key into code, documentation, arguments, metadata, browser assets or logs.

## Timer And Publication Boundary

The owner removed the old `ai.hexly.zoo.audio` LaunchAgent on 2026-10-12. It was unloaded and both installed and repository plist files were removed. Keep it disabled. The dormant legacy `--scheduled` CLI is not a registered task and is not part of the daily continuation.

Speech authorization alone does not authorize publication. The owner separately authorized the v1.3.0 release and deployment on 2026-10-14 after completing and validating these forty recordings. The generator performs no automatic commits, push or deployment; source/media changes are reviewed and committed separately. The 2026-10-15 v1.4.0 → bounded replacement run → v1.4.1 sequence is separately authorized as stated above, not yet evidence of completion. Further generation after that run stops requires a fresh instruction even after the daily counter resets.
