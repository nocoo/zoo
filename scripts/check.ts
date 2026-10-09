import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { categories, chineseNumber, pictures } from '../src/content.ts';

assert.equal(pictures.length, 246);
assert.equal(new Set(pictures.map(p => p.id)).size, pictures.length);
for (const category of categories) {
  const items = pictures.filter(p => p.category === category.id);
  assert.equal(items.length, category.id === 'numbers' ? 100 : category.id === 'letters' ? 26 : 20);
  for (const item of items) {
    assert.ok(item.name && item.pronunciation && item.description);
    if (item.image) assert.ok(existsSync(`public${item.image}`), `Missing ${item.image}`);
  }
}
for (const [value, label] of [[1, '一'], [10, '十'], [11, '十一'], [20, '二十'], [99, '九十九'], [100, '一百']] as const) {
  assert.equal(chineseNumber(value), label);
}
assert.ok(existsSync('public/art/hero.webp'));
console.log('检查通过：8 个分类、246 张内容卡、全部插画和数字读法。');
