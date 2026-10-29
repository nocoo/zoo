# New Category Style Studies (2026-10-30)

Owner request: add new categories, make each of them thick, and show one sample per
category for style approval before fanning out the rest.

Three native 2048 x 1792 samples were generated with Azure `gpt-image-2.5-sunburst`
at high quality, 40 seconds apart, one request each, no retries. Every directory
keeps the exact prompt, sanitized request/response and untouched PNG.

| Sample | Category | Template | References |
| --- | --- | --- | --- |
| `colors-01` | 认识颜色 | symbol (glyph-style hero) | `numbers-1`, `letters-A` natives |
| `shapes-01` | 认识形状 | symbol (glyph-style hero) | `numbers-1`, `letters-A` natives |
| `family-01` | 我的家人 | figurative (places cast) | `expansion/2026-10-14/places-01`, `places-07` natives |

Status: **awaiting owner style review**. Nothing is integrated into `src/content.ts`,
no delivery assets exist, and no further image request is authorized until the
owner approves these samples.

## Planned scope after approval

- `colors`: 10 cards — 红、黄、蓝、绿、橙、紫、粉、黑、白、棕
- `shapes`: 8 cards — 圆形、正方形、三角形、长方形、椭圆形、星形、心形、菱形
- `family`: 7 cards — 妈妈、爸爸、爷爷、奶奶、宝宝、哥哥、姐姐

25 cards total, 3 already sampled, 22 remaining to generate.
