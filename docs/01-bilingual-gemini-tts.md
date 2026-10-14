# Bilingual Gemini Narration

Status: on 2026-10-14 the owner explicitly approved the remaining 40 English replacements, confirmed that numbers and letters stay excluded, and requested a Y+1 release after completion. All 40 recordings completed without errors or retries using the existing Gemini model, Sulafat voice and approved copy. Eligible coverage is now 240/240. No timer is installed; any further generation needs fresh approval.

## Reading Contract

[Review all 176 bilingual cards and their local status](02-bilingual-copy.md). `src/content.ts` owns the copy. Existing Chinese names, pinyin, descriptions, English labels and the approved lion explanation are unchanged.

- 120 picture/character/phrase cards: each language reads the name plus the full explanation.
- 30 numbers: Mandarin retains number-name-only narration; English targets name plus counting explanation. Both languages are excluded from current generation.
- 26 letters: one American English alphabet-name clip is shared by both playback entries. Descriptions are editorial, not narration. Letters are excluded from current generation.
- Total full-coverage target: 326 unique recordings, not 352. Current eligible scope: 240 recordings for 120 non-number/non-alphabet cards.
- Captions always match the selected recording. Pending English Edge clips still read and caption only their names, not unrecorded explanations.

## Verified Local Inventory

Updated after the 2026-10-14 completion. Completed recordings match their target transcript, model, Sulafat voice, style and WAV/MP3 hashes. `src/media.json` selects these local recordings.

| Category | Mandarin complete | Mandarin pending | English complete | English pending | Shared alphabet pending |
| --- | ---: | ---: | ---: | ---: | ---: |
| Animals | 20 | 0 | 20 | 0 | 0 |
| Fruit | 20 | 0 | 20 | 0 | 0 |
| Weather | 20 | 0 | 20 | 0 | 0 |
| Objects | 20 | 0 | 20 | 0 | 0 |
| Chinese characters | 20 | 0 | 20 | 0 | 0 |
| Phrases | 20 | 0 | 20 | 0 | 0 |
| Numbers 1-30 (excluded) | 0 | 30 | 0 | 30 | 0 |
| Alphabet A-Z (excluded) | 0 | 0 | 0 | 0 | 26 |
| Total | 120 | 30 | 120 | 30 | 26 |

240/326 unique Gemini targets are complete locally; the remaining 86 are excluded number/alphabet recordings. All 240 currently eligible recordings are complete, with full name-plus-explanation narration in both languages. Every excluded item retains existing Edge playback.

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

The local ledger records 102 attempts today: six seeded successes, 84 successful daily-batch requests, then eleven more successes and one rejected request. This differs from the provider's reported 100/day limit; local-day accounting is not the provider quota window and the exact discrepancy is not established. Do not rewrite counts to force agreement. The reported retry deadline is approximately 2026-10-13 08:00 Asia/Shanghai; it is recorded in the preserved local cooldown state, not scheduled for automatic execution.

The explicit continuation flag is allowed only with the number/alphabet-excluding bilingual queue, keeps counting all attempts with an approval marker, stops on any error or queue exhaustion, and never changes the default 90-attempt cap. Do not use it again without fresh approval.

## Remaining Scope

No eligible jobs remain. The 30 Mandarin number recordings, 30 English number recordings and 26 shared alphabet recordings remain excluded and use Edge playback. Do not start them, reinstall a timer or regenerate any completed recording without fresh explicit approval.

## Execution And Budget

- Approved provider/model: Gemini Interactions API, `gemini-3.8-flash-tts`; voice: `Sulafat`. Preserve the approved faster Mainland Mandarin style and natural American English explanation style in `scripts/generate-audio.py`.
- Authorized daily continuation: `python3 scripts/generate-audio.py --bilingual-day`. This constructs all eligible Mandarin jobs before English, in category order animals, fruits, weather, objects, hanzi, phrases. Existing matching recordings are validated without rewriting them; only pending jobs use the provider. Number and alphabet jobs are never included.
- Offline inventory/queue check: `python3 scripts/generate-audio.py --check --bilingual-day`. No keys, network, writes or full-coverage requirement; missing eligible jobs are reported as pending. This is not a pronunciation review.
- Generation is sequential, with at least 20 seconds between request starts, under the existing exclusive filesystem lock. Each result is saved immediately. Any provider/file error stops the run; there is no automatic retry, fallback model, key rotation or billing change.
- `artifacts/audio-schedule/request-budget.json` records a conservative local-calendar-day maximum of 90 attempts across all generator modes. Each request is reserved before network access, so failed attempts count. The first entry for a date seeds known successes from that day's generated WAV modification dates; on 2026-10-12 six were verified before the ledger began. Preserve the ledger and old cooldown history.
- This ledger is not a provider quota meter: historical errors reported 100 requests/day on Tier 1, shared with His.fm. File timestamps cannot reveal other-device/shared usage or failed requests before the ledger existed. The local date boundary is not a provider reset contract. Respect actual provider errors/reset instructions.
- The daily mode does not use the obsolete all-catalogue completion flag or write a partial `src/audio-manifest.json`. `scripts/build-media.mjs` selects exact-transcript, hash-validated Gemini files independently by language and writes `src/media.json` for dev/build. Builds never invoke a speech provider.
- Originals remain in `design/audio/<id>.wav|json`, with English under `design/audio/en/`; MP3 delivery follows the same structure in `public/audio/`. Keep all Edge files and prior approved takes. Archive old WAV/JSON/MP3 together before any separately authorized changed-text replacement.
- Credentials remain private in the existing His.fm configuration. Never print or copy the key into code, documentation, arguments, metadata, browser assets or logs.

## Timer And Publication Boundary

The owner removed the old `ai.hexly.zoo.audio` LaunchAgent on 2026-10-12. It was unloaded and both installed and repository plist files were removed. Keep it disabled. The dormant legacy `--scheduled` CLI is not a registered task and is not part of the daily continuation.

Speech authorization alone does not authorize publication. The owner separately authorized the v1.3.0 release and deployment on 2026-10-14 after completing and validating these forty recordings. The generator performs no automatic commits, push or deployment; source/media changes are reviewed and committed separately. Future generation requires a fresh instruction even after the daily counter resets.
