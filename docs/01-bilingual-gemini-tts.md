# Bilingual Gemini Narration

Status: 2026-10-29, complete. All 480 eligible Gemini recordings are finished — 240 Mandarin plus 240 English for every non-number/non-alphabet card. The owner asked to continue the queue in order until the day's budget was spent; the 2026-10-24 15:00 cooldown had elapsed, so plain `--bilingual-day` ran with the 100-attempt local ceiling as the stop rule. It completed the remaining 91 clips (43 Mandarin and 43 English for the 2026-10-23 additions, plus `en/places-04`..`08`) in one sequential pass with no errors, using 91 of 100 attempts and emptying the queue. Commit `ada8689`; `npm run check` and `npm run build` pass. v1.5.1 (`6d02fd5`) is deployed; exact-revision CI [40874646579](https://github.com/nocoo/zoo/actions/runs/40874646579) passed and `/api/live` reports version `1.5.1`. The release also deleted the 521 Edge clips these recordings replaced. The 2026-10-23 quota stop is kept below as history.

## Reading Contract

[Review bilingual copy and local status](02-bilingual-copy.md). `src/content.ts` assembles all 253 cards, including the 77 approved additions from `src/expansion.ts`. Existing Chinese names, pinyin, descriptions, English labels and the approved lion explanation are unchanged.

- 240 picture/character/phrase cards: each language reads the name plus the full explanation.
- 30 numbers: Mandarin retains number-name-only narration; English targets name plus counting explanation. Both languages are excluded from current generation.
- 26 letters: one American English alphabet-name clip is shared by both playback entries. Descriptions are editorial, not narration. Letters are excluded from current generation.
- Total full-coverage target: 480 unique recordings, not 506 (letters share clips). Current eligible scope: 480 recordings for 240 non-number/non-alphabet cards, all complete.
- Captions always match the selected recording. Original Edge English clips retain name-only narration; the 77 expansion English clips already include full explanations. Gemini has priority independently in both languages.

## Verified Local Inventory

Updated after the completed 2026-10-29 batch. Completed recordings match their exact transcript, model, Sulafat voice, style and WAV/MP3 hashes. `src/media.json` selects these recordings; every pre-existing audio/archive file remains byte-identical.

| Category | Mandarin complete | Mandarin pending | English complete | English pending | Shared alphabet pending |
| --- | ---: | ---: | ---: | ---: | ---: |
| Animals | 35 | 0 | 35 | 0 | 0 |
| Fruit | 26 | 0 | 26 | 0 | 0 |
| Weather | 29 | 0 | 29 | 0 | 0 |
| Objects | 37 | 0 | 37 | 0 | 0 |
| Chinese characters | 20 | 0 | 20 | 0 | 0 |
| Phrases | 37 | 0 | 37 | 0 | 0 |
| Transport | 15 | 0 | 15 | 0 | 0 |
| Vegetables | 13 | 0 | 13 | 0 | 0 |
| Food | 16 | 0 | 16 | 0 | 0 |
| Places | 12 | 0 | 12 | 0 | 0 |
| Numbers 1-30 (excluded) | 0 | 30 | 0 | 30 | 0 |
| Alphabet A-Z (excluded) | 0 | 0 | 0 | 0 | 26 |
| Total | 240 | 0 | 240 | 0 | 26 |

480/480 unique Gemini targets are complete locally, with no pending eligible slot. Numbers and alphabet remain excluded and keep their existing Edge recordings; the shared alphabet clip is unchanged. Every card already has both playback URLs.

These inventory numbers describe validated local files, not production deployment. The last 91 clips are committed but not released.

## Completed On 2026-10-29

The owner asked to resume the queue in order and continue until the day's budget was spent. The recorded cooldown had already passed and no generator held the lock, so plain `--bilingual-day` ran without `--until-provider-error`, keeping the 100-attempt local ceiling as the stop rule rather than exceeding it. The run completed all 91 remaining targets — 43 Mandarin (animals-30..35, weather-26..29, objects-32..37, phrases-30..37, transport-11..15, vegetables-10..13, food-11..16, places-09..12) and 43 matching English clips, then `en/places-04`..`08` — with 20-second spacing, no retry and no provider error. 91 of 100 attempts were used; the queue emptied before the ceiling, so the unused nine were never requested.

`python3 scripts/generate-audio.py --check --bilingual-day --until-provider-error` reports 480/480 with an empty next batch. `npm run check` and `npm run build` pass. Commit `ada8689` holds 182 `design/audio` files, 91 `public/audio` MP3s and the regenerated `src/media.json`.

## Stopped On 2026-10-23

The owner reviewed the `vegetables-06` sample and approved continuing the whole queue until completion or the first error, and raised the local daily ceiling from 90 to 100 attempts. `--bilingual-day --until-provider-error` then completed the remaining 21 Mandarin clips (vegetables-07..09, food-01..10, places-01..08) and 72 English clips (all 77 expansion English recordings except places-04..08). Attempt 96 at `en/places-04` returned HTTP 429; no retry, model fallback, key rotation or billing change followed. The local ledger holds 95 attempts for the day, so the difference from the provider's 100/day limit is shared His.fm or other-device usage. The provider reported 19h14m38s until reset, recorded in the preserved cooldown state without a timer.

The local ledger for 2026-10-23 needed one manual correction: a fresh checkout had restored every WAV with that day's mtime, which the seeder would have counted as 90 completed requests. No provider call preceded the run, so the day's seeded list is empty and the entry records why. Every pre-existing WAV/JSON/MP3 stayed byte-identical; each new MP3 decoded fully.

## Stopped On 2026-10-15

55 Mandarin replacements completed: animals-21..29 (9), fruits-21..26 (6), weather-21..25 (5), objects-21..31 (11), phrases-21..29 (9), transport-01..10 (10), vegetables-01..05 (5). No new English request was sent. Attempt 56 on vegetables-06 returned HTTP 429; no retry, model fallback, key rotation or billing change followed. The provider reported a shared Tier 1 limit of 100/day and 11h35m58s until reset. Zoo's local 56 attempts are not the provider's complete usage; do not rewrite the ledger to force agreement. The old cooldown entries remain, with the new deadline recorded around 2026-10-16 08:00 Asia/Shanghai.

Retain all 165 new WAV/JSON/MP3 files and all 1,777 pre-run files. The remaining Mandarin IDs are vegetables-06..09, food-01..10 and places-01..08; all 77 expansion English recordings remain Edge. Logs and preservation evidence are in ignored `artifacts/expansion-audio/2026-10-15/`. There is no automatic continuation. Human pronunciation review remains separate.

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

The explicit continuation flag is allowed only with the number/alphabet-excluding bilingual queue, keeps counting all attempts with an approval marker, stops on any error or queue exhaustion, and never changes the default 100-attempt cap. Do not use it again without fresh approval.

## Remaining Scope

Nothing remains eligible. As of 2026-10-29 the queue is empty at 480/480, and the 30 Mandarin number recordings, 30 English number recordings and 26 shared alphabet recordings stay excluded on Edge playback. Do not start them, reinstall a timer, retry a stopped run or regenerate any completed recording without fresh explicit approval.

## Execution And Budget

- Approved provider/model: Gemini Interactions API, `gemini-3.8-flash-tts`; voice: `Sulafat`. Preserve the approved faster Mainland Mandarin style and natural American English explanation style in `scripts/generate-audio.py`.
- Historical command for the stopped 2026-10-15 continuation after verified v1.4.0 deployment (do not rerun without fresh approval): `python3 scripts/generate-audio.py --bilingual-day --until-provider-error`. The default `--bilingual-day` retains its 100-attempt cap. Both construct all eligible Mandarin jobs before English, in category order animals, fruits, weather, objects, hanzi, phrases, transport, vegetables, food, places. Existing matching recordings are validated without rewriting them; only pending jobs use the provider. Number and alphabet jobs are never included.
- Offline inventory/full authorized queue check: `python3 scripts/generate-audio.py --check --bilingual-day --until-provider-error`. No keys, network, writes or full-coverage requirement; missing eligible jobs are reported as pending. This is not a pronunciation review.
- Generation is sequential, with at least 20 seconds between request starts, under the existing exclusive filesystem lock. Each result is saved immediately. Any provider/file error stops the run; there is no automatic retry, fallback model, key rotation or billing change.
- `artifacts/audio-schedule/request-budget.json` records a local-calendar-day maximum of 100 attempts across all generator modes. Each request is reserved before network access, so failed attempts count. The first entry for a date seeds known successes from that day's generated WAV modification dates; on 2026-10-12 six were verified before the ledger began. Preserve the ledger and old cooldown history.
- This ledger is not a provider quota meter: historical errors reported 100 requests/day on Tier 1, shared with His.fm. File timestamps cannot reveal other-device/shared usage or failed requests before the ledger existed. The local date boundary is not a provider reset contract. Respect actual provider errors/reset instructions.
- The daily mode does not use the obsolete all-catalogue completion flag or write a partial `src/audio-manifest.json`. `scripts/build-media.mjs` selects exact-transcript, hash-validated Gemini files independently by language and writes `src/media.json` for dev/build. Builds never invoke a speech provider.
- Originals remain in `design/audio/<id>.wav|json`, with English under `design/audio/en/`; MP3 delivery follows the same structure in `public/audio/`. Keep all Edge files and prior approved takes. Archive old WAV/JSON/MP3 together before any separately authorized changed-text replacement.
- Credentials remain private in the repository `.env` (`GEMINI_API_KEY`, gitignored). Never print or copy the key into code, documentation, arguments, metadata, browser assets or logs.

## Timer And Publication Boundary

The owner removed the old `ai.hexly.zoo.audio` LaunchAgent on 2026-10-12. It was unloaded and both installed and repository plist files were removed. Keep it disabled. The dormant legacy `--scheduled` CLI is not a registered task and is not part of the daily continuation.

Speech authorization alone does not authorize publication. The owner separately authorized the v1.3.0 release and deployment on 2026-10-14 after completing and validating these forty recordings. The generator performs no automatic commits, push or deployment; source/media changes are reviewed and committed separately. The 2026-10-15 v1.4.0 → bounded replacement run → v1.4.1 sequence was separately authorized: v1.4.0 is verified deployed, the bounded run is stopped at quota, and v1.4.1 publishes only its completed clips. Exact-revision CI and online checks establish each deployment, not generation counts. Further generation after that run stops requires a fresh instruction even after the daily counter resets.
