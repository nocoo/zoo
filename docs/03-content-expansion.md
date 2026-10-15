# Approved Content Expansion

Status: 2026-10-15 playable integration. The owner approved all 77 illustrations/copy and authorized generation and publication of 154 Edge clips; the recordings have not received sentence-by-sentence listening or pronunciation approval. `src/content.ts` now assembles 253 cards across 12 categories, preserving the original 176 exact texts, ordering within each category, image URLs, recordings and captions. `src/expansion.ts` remains the approved expansion-copy source. The obsolete `?review=expansion` draft UI, its styles and separate playback hook are removed; all cards use the main gallery, favorites, random sessions and viewer.

The owner authorized integration/publication as v1.4.0, then only the 154 new Gemini targets after that deployment, Mandarin first until the first quota/provider/file error or queue completion, then v1.4.1. Root owns provider execution, version changes, release/deployment and final results. Integration work makes no provider calls and does not bump, push or deploy. No timer, automatic retry, endpoint/key/quota bypass or additional image API is authorized.

## Inventory

77 additions: 37 in four new categories, 40 in five existing categories. All bilingual fields remain in `src/expansion.ts`; food and vegetable names are everyday culinary labels. 橘子 / Mandarin orange and 柚子 / Pomelo stay distinct from 橙子 / Orange. These cards are optional shared exploration, not developmental requirements.

| Group | Category id | Added | Total playable | Expansion IDs |
| --- | --- | ---: | ---: | --- |
| 交通工具 | transport | 10 | 10 | transport-01..10 |
| 蔬菜 | vegetables | 9 | 9 | vegetables-01..09 |
| 饭桌食物 | food | 10 | 10 | food-01..10 |
| 一起出门 | places | 8 | 8 | places-01..08 |
| 身边物品 | objects | 11 | 31 | objects-21..31 |
| 动物朋友 | animals | 9 | 29 | animals-21..29 |
| 开口说说 | phrases | 9 | 29 | phrases-21..29 |
| 天气自然 | weather | 5 | 25 | weather-21..25 |
| 缤纷水果 | fruits | 6 | 26 | fruits-21..26 |

Unchanged categories: numbers 30, letters 26, hanzi 20. New animal groups: pig/chick/goose join 农场伙伴; butterfly/snail/ant/bee/ladybug/caterpillar join 花园小伙伴. Every animal belongs to a visible filter. Counts follow the actual filtered collection. Desktop category tiles use two rows of six; mobile retains four columns.

## Integrated Media Contracts

- All 77 natives and 154 delivery WebPs are complete and owner-approved. `src/expansion-art.json` preserves their content-versioned thumbnail/full URLs. Raw playable paths live under `/art/expansion/`; `scripts/build-media.mjs` hashes those files alongside the 176 original `/art/hd/` pairs into `src/media.json`. `imageLarge` is the normalized 2048 × 1792 delivery WebP, not the provider PNG. Thumbnails are 640 × 560. Native outputs, exact references, prompts and request records remain under `design/art/expansion/`.
- Edge 7.3.1 completed 154/154 recordings, committed with `src/expansion-media.json` in `1d7320f`. Voices remain `zh-CN-XiaoxiaoNeural` at `+10%` and `en-US-JennyNeural` at `+0%`. Expansion transcripts are exactly `ZH name。description` and `EN name. description`.
- Original Edge English recordings retain their name-only contract. `edgeEnglishAudioTranscript` is shared by the media builder and normal/expansion Edge modes, so new live cards never accidentally request a short English replacement. Identical files are skipped; mismatches, empty files, bad hashes and orphans fail without overwrite. Normal Edge generation skips existing Gemini recordings independently in both languages.
- `--expansion` selects exactly the 77 live additions in approved source order, not isolated drafts. Outputs stay in `design/audio-edge/{zh,en}/` and `public/audio-edge/{zh,en}/`. The preserved `src/expansion-media.json` records the Edge inventory; playback and captions use the integrated `src/media.json`.
- Gemini remains preferred independently for each language. Replacements use the same approved full text, model, voice and styles. `bilingual_jobs` includes all ten non-number/non-alphabet categories: 394 eligible targets, 240 complete, 154 pending before the root-owned run. All 77 pending Mandarin targets precede all 77 pending English targets. Numbers and letters remain excluded (86 unique targets).
- Opening/switching/closing cards stays silent; only language-button clicks play audio. Existing exclusive playback, interruption handling, stable subtitle geometry and at-most-four neighbor image preloads apply to every new card. No runtime TTS, collection audio preload or offline-speech claim is added.
- Builds and all `--check` commands are offline with respect to speech providers. Keep the shared generation lock, budget ledger, historical cooldown, 20-second Gemini request spacing and first-error stop intact. The opt-in local-cap override does not change provider quotas or authorize a later retry.

## History And Recovery

Copy was approved at `c6344b5` on 2026-10-14. The first authorized Edge 7.2.8 run stopped on `transport-01` Mandarin/English websocket HTTP 403 with 0/154 completed. The application did not retry or schedule later pairs; that library version retried each websocket once internally. Root cause was not established. Zero-byte tmp files and the original log remain under `artifacts/expansion-audio/failed-first-pair/{zh,en}/` and `artifacts/expansion-audio/generation.log`.

The fresh owner-authorized 2026-10-15 Edge 7.3.1 run completed all 154. This supersedes the earlier generation hold, not preservation rules. For similar failures, inspect the maintained client's latest release and use an explicitly authorized bounded probe before prolonged stale-version troubleshooting. Do not bypass endpoints, credentials, quotas or required owner approval. No further Edge generation is needed.

Illustration generation used Workflow Azure `gpt-image-2.5-sunburst`, native 2048 × 1792, existing-card style, at most three in-flight and 40 seconds between starts, without automatic retries. The 2026-10-14 run stopped at 46/77; `places-05` timed out after 612.72 seconds. On 2026-10-15 the owner authorized the 30 never-requested images, then one manual retry each of timeout `places-05` and `animals-22` plus the remaining eleven. `animals-22` first timed out after 602.66 seconds. The day added 31 originals (18 then 13); retry-13 exited 0. Failed attempt records, original paths and SHA-256 manifest remain under `design/art/expansion/attempts/2026-10-15-authorized-retry`. Prior 64 deliveries stayed SHA-256 identical. No active pending or outcome-unknown image remains.

The first thumbnail export halted on `vegetables-04`: LANCZOS moved one paper corner to RGB distance 9, outside tolerance 8. Unrecorded derivatives were preserved under ignored `artifacts/expansion-art/halted-vegetables-04/` before regeneration. Processing retains tolerance 8 and restores the four exact paper corners after thumbnail resampling. Full bytes stayed identical; the new thumbnail SHA-256 is `80c969a54eb44e30d770e016c6ea2229e96f028b2f964d77a04410feede5232a`.

Historical visual findings remain in `design/art/expansion/2026-10-14/review.md`. Owner approval does not erase those findings or establish a completed independent last-13 review: that reviewer disconnected before reporting. Root's pre-integration Chromium/WebKit review of all 77 thumbnails and nine HD category links is recorded in `artifacts/expansion-art/2026-10-15/browser77.json`. Those review-page checks do not establish integrated viewer behavior or sentence-by-sentence pronunciation quality.

## Offline Validation

```sh
npm run check
npm run build
node scripts/check-pwa.mjs
node --experimental-strip-types scripts/check-audio-player.ts
python3 -B scripts/check-audio-schedule.py
python3 -B scripts/check-edge-expansion.py
python3 -B scripts/generate-edge-audio.py --check
python3 -B scripts/generate-edge-audio.py --check --expansion
python3 -B scripts/generate-audio.py --check --bilingual-day --until-provider-error
```

`npm run check` asserts exact 253/12 counts, the approved 77 IDs/names/fields, name isolation from the original 176, all animal groups, both image sizes, both audio URLs/captions and every category's neighbor order. Frozen SHA-256 regression values come from the root's unchanged `artifacts/expansion-audio/2026-10-15/before-content.json` and `before-media.json`, captured before integration at the `1d7320f` media baseline. They protect every original field and all 352 image URLs, 352 playback entries and 352 transcripts without requiring ignored snapshots or Git history in CI.

The Edge harness uses local/mocked data only: exact 77/154 scope now within 253 live cards, original name-only versus new full-English contracts, skip-identical without network, mismatch/orphan/empty rejection, write-free checks, shared-lock isolation and failure-stop scheduling. The schedule harness uses isolated fixtures with explicit original completed IDs and expansion IDs: 394 eligible, 240 complete, 154 pending, 77 Mandarin before 77 English including all four new categories. A one-clip-completed fixture verifies a 153-target resume without regeneration. Real inventory accepts subsequent authorized completions while validating every existing Gemini file, requiring all original 240 and restricting pending targets to the expansion. The Edge harness also checks normal-mode skipping after one Gemini completion while retaining all 154 archived Edge entries. Existing budget/cooldown/selection/error tests remain intact.

Integration checks/build/player/schedule/Edge/PWA validation passed locally. Targeted Chromium and WebKit checks at 320/390 px passed after enabling filter wrapping: all five animal filters remain fully visible without horizontal overflow, and 花园小伙伴 shows six cards. The new Car/Donut/Location icons were checked for invalid React SVG property names; CoffeeCup/Map were replaced without dependency edits. The frozen 1,469-file audio/archive snapshot is verified separately without mutation. These checks are basic integration evidence, not a full quality audit or listening approval. Root finalizes browser acceptance, actual v1.4.0/v1.4.1 results, release-commit build identity and online deployment evidence.
