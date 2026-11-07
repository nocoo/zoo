# Bilingual Gemini Narration

Status: 2026-11-07. Eligible scope is 608 recordings for 304 non-number/non-alphabet cards. All 608 are complete Gemini/Sulafat takes and nothing is pending. Today's two runs covered 58 takes for the 29 animal and fruit cards and 20 takes for the ten extra animals; every temporary Edge clip and its provenance was deleted afterwards, so only the 86 Edge files that numbers and the alphabet reference remain. v1.8.0 (`ba2d1a9`) is deployed; exact-revision CI [42341384741](https://github.com/nocoo/zoo/actions/runs/42341384741) passed and `/api/live` reports `1.8.0` at that revision. GitHub Release `v1.8.0` is published.

## Reading Contract

[Review bilingual copy and local status](02-bilingual-copy.md). `src/content.ts` assembles all 253 cards, including the 77 approved additions from `src/expansion.ts`. Existing Chinese names, pinyin, descriptions, English labels and the approved lion explanation are unchanged.

- 240 picture/character/phrase cards: each language reads the name plus the full explanation.
- 30 numbers: Mandarin retains number-name-only narration; English targets name plus counting explanation. Both languages are excluded from current generation.
- 26 letters: one American English alphabet-name clip is shared by both playback entries. Descriptions are editorial, not narration. Letters are excluded from current generation.
- Total full-coverage target: 530 unique recordings (letters share clips). Actual eligible scope: 530 recordings for 265 non-number/non-alphabet cards, all Gemini.
- Captions always match the selected recording. The 77 expansion English clips and all 25 basic-category English clips include full explanations; number English clips still carry the pre-Edge name-only narration because numbers keep their Edge takes. Gemini has priority independently in both languages.

## Verified Local Inventory

Updated after the completed 2026-11-06 batch. Completed recordings match their exact transcript, model, Sulafat voice, style and WAV/MP3 hashes. `src/media.json` selects these recordings; every pre-existing audio/archive file remains byte-identical.

| Category | Mandarin complete | Mandarin pending | English complete | English pending | Shared alphabet pending |
| --- | ---: | ---: | ---: | ---: | ---: |
| Animals | 35 | 0 | 35 | 0 | 0 |
| Fruit | 26 | 0 | 26 | 0 | 0 |
| Colors | 10 | 0 | 10 | 0 | 0 |
| Shapes | 8 | 0 | 8 | 0 | 0 |
| Family | 7 | 0 | 7 | 0 | 0 |
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
| Total | 265 | 0 | 265 | 0 | 26 |

530/530 unique Gemini targets are complete locally, with no pending eligible slot. Numbers and alphabet remain excluded and keep their Edge recordings; the shared alphabet clip is unchanged. Every card has both playback URLs.

These inventory numbers describe validated local files, not production deployment. All 130 clips added on 2026-10-29 and 2026-11-06 are released in v1.6.0 and v1.6.1.

## Completed On 2026-11-07 (second run)

The owner picked the combined option for the ten animals added the same day: Gemini for their 20 targets and a release. A read-only `GET /v1beta/models?pageSize=1` probe again returned HTTP 200 from the direct Tokyo egress `74.82.193.28`, and the local ledger held 58 attempts for the day, so 42 of 100 remained against 20 needed.

One `--bilingual-day` run completed 20/20 - ten Mandarin then ten English - with 20-second spacing, no retry, no model fallback and no provider error. The day's ledger closes at 78 attempts with 22 unused, and the queue is empty.

The 20 temporary Edge clips and their provenance were deleted from the keep list derived from the same `src/media.json` fields the build consumes, leaving exactly the 86 number and alphabet recordings. `python3 scripts/generate-audio.py --check --bilingual-day` reports 608/608 and `uv run --with edge-tts==7.3.1 --no-project python scripts/generate-edge-audio.py --check` passes. Chromium played 孔雀, 蝌蚪 and 北极熊 in both languages from `/audio/` with no failed request and no console error. These are not sentence-by-sentence pronunciation approvals.

## Completed On 2026-11-07

The owner reviewed the 29 new animal and fruit cards and said 通过。进行gemini tts, authorizing the remaining 58 targets. Nothing else changed: same model `gemini-3.8-flash-tts`, same `Sulafat` voice, same styles, 20-second spacing, one exclusive lock, no retry, no model fallback.

Before synthesis a read-only `GET /v1beta/models?pageSize=1` probe returned HTTP 200. The egress was the direct Tokyo address `74.82.193.28` (AS21887), so unlike 2026-11-06 no proxy was needed; the Singapore route stayed unused. Quota was not in play: the ledger held no attempts for the day.

One `--bilingual-day` run completed 58/58 - 29 Mandarin then 29 English - with no error and no interruption. 58 of the 100-attempt local cap are recorded, leaving 42 unused, and the queue is empty. Every new MP3 decodes fully with FFmpeg.

The 58 temporary Edge clips and their provenance were then deleted by deriving the keep list from the same `src/media.json` fields the build consumes, which left exactly the 86 number and alphabet recordings. `python3 scripts/generate-audio.py --check --bilingual-day` reports 588/588, `uv run --with edge-tts==7.3.1 --no-project python scripts/generate-edge-audio.py --check` passes, and `npm run check`, `npm run build` and `node scripts/check-pwa.mjs` pass. Chromium played the Mandarin and English takes for 奶牛, 桑葚 and 蜻蜓 with the expected captions and no failed media request. These are not sentence-by-sentence pronunciation approvals.

## Completed On 2026-11-06

The owner asked to finish the remaining queue and confirmed a Singapore proxy egress after the Hong Kong one was refused. A read-only `GET /v1beta/models?pageSize=1` probe showed the actual failure: HTTP 400 `User location is not supported for the API use.` with `103.116.72.119` (HK) as the egress; the same probe returned 200 from `23.249.26.180` (SG). The egress, not the credential or quota, was the blocker.

`--bilingual-day --until-provider-error` ran three times. The first two stopped at `en/colors-06` with a generic failure message: an `OSError` subclass from the connection layer escaped the generator's `except (urllib.error.URLError, TimeoutError)` handler and the top-level handler printed no detail. Commit `8430dbd` added `OSError` to that handler and made the top-level failure report the exception type and text. The third run completed 20/20 with no retry, no model fallback and 20-second spacing.

41 local attempts are recorded for the day, leaving 59 of the 100-attempt cap. `--check --bilingual-day --until-provider-error` reports 530/530. All 39 new MP3s decode fully with FFmpeg, and `npm run check`, `npm run build` and `--check` for the Edge inventory pass. Commit `6992997` holds the 39 WAV/JSON/MP3 sets plus `src/media.json`; `159071e` removed the 39 superseded Edge clips and their provenance. These are not sentence-by-sentence pronunciation approvals.

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
