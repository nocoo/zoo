# Basic Cognition Categories

Status: 2026-10-30. The owner asked for new categories with meaningful thickness,
reviewed one sample per category, and authorized the rest plus a release.

Three categories were added before the existing 汉字宝宝 section so number, letter,
color, shape and family recognition read as one foundation group:

| Category | 中文名 | Cards | Template |
| --- | --- | ---: | --- |
| `colors` | 认识颜色 | 10 | symbol — oversized gouache swatch as hero |
| `shapes` | 认识形状 | 8 | symbol — crisp geometric hero |
| `family` | 我的家人 | 7 | figurative — places adult/child cast |

The library moved from 296 cards across 12 categories to 321 across 15. Colors are
红黄蓝绿橙紫粉黑白棕; shapes are 圆形、正方形、三角形、长方形、椭圆形、星形、心形、菱形; family
is 妈妈、爸爸、爷爷、奶奶、宝宝、哥哥、姐姐.

## Style Decisions

Both symbol categories reuse the numbers/letters prompt grammar: one very large
instantly legible hero, flat `#faf6e8` cream paper, tactile gouache with
colored-pencil grain, and exactly one small concrete object beside it as a memory
hook. `colors-09` (白色) carries one delicate warm-grey painted outline because a
white patch would otherwise vanish into the cream paper. Every shape card pairs a
named geometric hero with a real object of that shape, and each prompt forbids a
second plain shape so a child cannot read two candidates.

Family cards use the figurative expansion template and the `places-01`/`places-07`
cast for paint, grain and proportions. Each prompt fixes role, apparent age,
clothing and gesture, and forbids other people in frame so one relative reads
unambiguously. 宝宝 is explicitly plumper and younger than the reference toddler;
哥哥 and 姐姐 are explicitly children, not adults.

## Pipeline

Prompts and the manifest live beside the run:

```sh
python3 -B design/art/expansion/2026-10-30/prepare.py
python3 -B design/art/expansion/generate.py --run 2026-10-30 --check
python3 -B design/art/expansion/generate.py --run 2026-10-30
uv run --with pillow python design/art/expansion/process.py --run 2026-10-30 --art src/foundations-art.json --dir foundations
uv run --with pillow python design/art/expansion/process.py --run 2026-10-30 --art src/foundations-art.json --dir foundations --check
```

`prepare.py` never rewrites an existing prompt, so the three owner-reviewed samples
keep their exact original prompts and request records. The first card of each
category is that sample; the remaining cards take it plus the symbol references as
style references, which keeps a batch internally consistent.

Generation reuses the unchanged helper with `gpt-image-2.5-sunburst` at native
2048 x 1792, three in-flight requests, 40-second spacing, an exclusive lock and no
automatic retry. Delivery is lossless WebP at 2048 x 1792 plus 640 x 560 thumbnails
with the same edge-connected paper normalization (RGB tolerance 8) used elsewhere.
`--dir foundations` writes `public/art/foundations/` and `/art/foundations/` URLs;
`src/foundations-art.json` records the content-versioned map. `process.py` keeps
`--dir expansion` as the default so the 2026-10-14 and 2026-10-23 batches are
unchanged.

## Verification

`scripts/check-foundations.ts` asserts the three categories, all 25 ids in order,
required fields, pinyin shape, terminal punctuation, the `/art/foundations/` image
paths and the position of these cards in `src/pictures`. `npm run check` additionally
covers exact category counts, both image sizes, both audio URLs and the neighbor
preload order.

Playback uses the same Gemini pipeline with the colors, shapes and family queue
inserted after fruits, two recordings per card. Numbers and alphabet remain the only
Edge playback. As everywhere in this project, automated checks are not
sentence-by-sentence pronunciation approval.
