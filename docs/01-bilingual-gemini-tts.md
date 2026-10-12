# Complete Gemini Narration In Both Languages

Status: full bilingual batch pending; one authorized lion English sample generated locally on 2026-10-12, awaiting listening approval.

## Completion Contract

Every active card must use Gemini for every visible playback language. A card is not complete merely because its Mandarin recording is ready. At the baseline, `animals-01` had approved Gemini Mandarin but name-only Edge English. The local sample now replaces its English with Gemini name-plus-explanation; production remains unchanged.

- Retain 150 non-alphabet cards with separate Mandarin and English recordings.
- Retain 26 alphabet cards with one American English letter-name recording shared by both manifest entries.
- Total: 326 unique recordings for 176 cards. Do not generate numbers above 30.
- Preserve all existing Gemini originals, metadata and MP3s byte-for-byte. Keep temporary Edge playback until the corresponding Gemini recording is validated and published.
- Playback remains static MP3 only, manually triggered, without browser speech synthesis or runtime provider calls.

## Verified Baseline

As of 2026-10-12 approximately 08:02 Asia/Shanghai, local recordings, the committed media manifest and production v1.1.1 match.

| Category | Mandarin pending | English pending | Shared alphabet pending |
| --- | ---: | ---: | ---: |
| Animals | 0 | 20 | 0 |
| Fruit | 0 | 20 | 0 |
| Weather | 0 | 20 | 0 |
| Objects | 0 | 20 | 0 |
| Chinese characters | 1 (cow) | 20 | 0 |
| Phrases | 20 | 20 | 0 |
| Numbers 1-30 | 30 | 30 | 0 |
| Alphabet A-Z | 0 | 0 | 26 |
| Total | 51 | 150 | 26 |

99 unique Gemini recordings are complete; 227 remain. There is no generated-but-unpublished backlog at this baseline. Recount before executing because the existing 08:30 job remains enabled.

## Implementation

1. Extend `src/audio.ts` to enumerate explicit card/language recording jobs. Mandarin keeps the existing approved transcript. English reads the English name followed by an approved English explanation corresponding to the Chinese description. Store the explanation as `Picture.englishDescription` in `src/content.ts`; translate naturally for toddlers, not mechanically word for word. Review both displayed languages before generating. Do not treat an English name-only clip as complete. Alphabet jobs read the letter name once.
2. Extend `scripts/generate-audio.py` to process that complete job list. Keep the existing Mandarin/alphabet paths unchanged; new non-alphabet English originals and metadata use `design/audio/en/<id>.wav|json` and MP3s use `public/audio/en/<id>.mp3`. Record the language, exact text/style, model, voice and hashes. Preserve the existing validated recordings and provenance; do not regenerate them to change directory layout.
3. Keep `gemini-3.8-flash-tts` and the warm female `Sulafat` voice. Preserve the approved Mandarin direction. Add a separate natural, clear American English word/phrase style, without slow spelling, phonics substitutions, exaggerated vowel stretching or extra commentary. Do not reuse the single-letter instruction for words like `Lion`.
4. Extend `scripts/build-media.mjs` to select validated Gemini recordings independently for `zh` and `en`; use the corresponding temporary Edge file only while that language is incomplete. Preserve content-versioned URLs. The existing `/audio/*` cache header and PWA audio exclusion must also cover `/audio/en/`.
5. Make the generator's final manifest bilingual, using the same per-card `{zh, en}` shape. Derive completion from all active unique jobs, never the old 176-record threshold. Do not let an old schedule `complete` flag suppress the new English work; inspect actual coverage while preserving its cooldown and lock.
6. Report generated, selected locally and deployed coverage separately, broken down by category and language. A successful build or a provider model-list response must not be reported as completed production replacement.

## Execution Sequence And Quota

- First preview and approve the lion bilingual name-plus-explanation copy in the local browser, without generating audio. Then implement and validate without provider calls. Only after explicit approval, generate an English lion name-plus-explanation sample for listening approval before the English batch. Count the approved sample toward the 150 English jobs; never generate it twice.
- Prioritize completing animals in both languages, then work through remaining card/language jobs in a deterministic order. Completed recordings always skip generation.
- Share one budget across both languages: at most 90 new jobs per scheduled run, at least 20 seconds between request starts, one exclusive lock, and at least 23 hours between scheduled attempts. Preserve successful results immediately; stop on rate limits or network errors without automatic retries or credential rotation.
- At the verified baseline, the 227 pending jobs require at least three fully available 90-job rounds (90 + 90 + 47). Other His.fm usage, sample approval, provider limits and failures can require more runs; this is not a promised three-day completion date.
- Review files, rebuild, commit and deploy separately after generation. The timer never commits or publishes. Verify production revision and the selected English MP3 before declaring a card fully replaced.

## Atomic Changes And Validation

1. Commit the bilingual job generator and minimal runnable checks for exact transcripts, letter deduplication, preservation, shared quota and completion state.
2. Commit independent bilingual media selection with checks for Gemini Mandarin plus Edge English, both Gemini languages, corrupted hashes, and missing English files. Run existing content, build, audio-player, schedule and PWA checks.
3. Archive and commit approved generated batches separately, then publish only within release authorization.

Use the existing basic validation scope, not a new full 6DQ rollout. All automated checks use local or mocked provider responses; no live paid generation in CI. Browser smoke checks verify silent opening/swiping and separate language-button URLs. Human listening approval covers the English voice and pace. Production acceptance verifies exact release revision and representative audio bytes, including English `Lion`.

## Current Boundary

The scheduled batch still covers Mandarin and shared alphabet recordings, not the additional 150 English jobs. A separate `--english-card` command now generates one explicitly selected sample; it shares the exclusive lock, never updates the batch manifest and cannot combine with scheduled mode. The existing schedule is unchanged. No further generation or deployment is authorized by this document. Credentials remain in the existing private His.fm configuration and must never be copied into documentation, code, logs or public assets.

## Lion Copy Preview (2026-10-12)

- Chinese name: 狮子
- Chinese explanation, unchanged: 狮子有一圈蓬松的鬃毛，像戴着小围巾。
- English name: Lion
- English explanation: The lion has a fluffy mane around his neck, like a little scarf.
- Only the lion has an English explanation for now. Per the owner's latest layout revision, the viewer initially hides explanations and uses bordered name-and-audio buttons without redundant language labels, with pinyin above Chinese. Clicking a language reveals its exact recorded transcript with approximate word highlighting from media playback progress. Switching cards clears it; finishing leaves the text without highlighting. The Chinese source transcript remains unchanged.
- One authorized Gemini request produced `design/audio/en/animals-01.wav` and matching JSON, with `public/audio/en/animals-01.mp3` selected locally. Transcript: `Lion. The lion has a fluffy mane around his neck, like a little scarf.` Model: `gemini-3.8-flash-tts`; voice: `Sulafat`; duration: 6.80 seconds. Metadata records language, exact text/style, interaction ID and hashes. All previous Gemini and Edge recordings are preserved.
- Run `python3 scripts/generate-audio.py --check --english-card animals-01` for offline validation. The owner must approve voice and pace before more English generation. At this sample boundary, 100 unique Gemini recordings are complete locally and 226 remain (51 Mandarin + 149 English + 26 shared alphabet). Production still has the baseline 99 until a separately authorized publication.
- The existing scheduled generator still covers the old Mandarin/alphabet scope. No timer configuration is changed by this preview.
