# Content Expansion Drafts

Status: phase 1 is a local review page plus bilingual copy only. The 77 drafts live in `src/expansion.ts` and are isolated from playable `src/content.ts`. Existing 176 cards and all media stay unchanged. These drafts await owner approval and are not developmental requirements.

Proposed later narration, after separate approval, reads the name plus the description in each language, matching picture and phrase cards.

## Inventory

77 cards: 37 in four new categories, 40 additions to five existing categories. Chinese names, pinyin, English labels and both descriptions are in `src/expansion.ts` only.

| Group | Category id | Kind | Count | IDs |
| --- | --- | --- | ---: | --- |
| 交通工具 | transport | new | 10 | transport-01..10 |
| 蔬菜 | vegetables | new | 9 | vegetables-01..09 |
| 饭桌食物 | food | new | 10 | food-01..10 |
| 一起出门 | places | new | 8 | places-01..08 |
| 身边物品 | objects | existing | 11 | objects-21..31 |
| 动物朋友 | animals | existing | 9 | animals-21..29 |
| 开口说说 | phrases | existing | 9 | phrases-21..29 |
| 天气自然 | weather | existing | 5 | weather-21..25 |
| 缤纷水果 | fruits | existing | 6 | fruits-21..26 |

New-category titles are the approved product names above. Additions reuse the live category names. Food and vegetable cards are everyday culinary labels. 橘子 is mandarin orange; 柚子 is pomelo; they stay distinct from live 橙子 / Orange.

## Six stages

1. **Review first.** Owner reads the local review page at https://zoo.dev.hexly.ai/?review=expansion. Copy may change. No speech or image provider requests.
2. **Owner approval.** Explicit sign-off on the draft list and wording. Approval of copy is not authorization to generate media, bump a version, or deploy.
3. **Edge bilingual generation.** Temporary Mandarin and English recordings for approved drafts, under a fresh explicit grant. Existing Gemini and Edge files stay untouched.
4. **Workflow GPT image generation.** Approved illustrations for the new cards, under a fresh explicit grant. Live art under `public/art/` and `design/art/` stays untouched until that grant.
5. **Validation and owner-authorized release.** Content, media, playback and release checks, then a separately authorized production release. Playable integration into `src/content.ts` happens in this stage, not before.
6. **Gemini replacements.** Mandarin first, then English, under a fresh scope and budget. No timer, leftover budget, or earlier grant is authorization.

## Checks

`npm run check` imports `scripts/check-expansion.ts` and asserts exact counts, unique IDs against the 176 live cards, nonempty fields, group kind and membership, name isolation, and that live content remains 176. No extra dependencies.

Skipped: speech, image, deploy, version bump. Add when the owner opens the matching later stage.
