import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { categories, chineseNumber, pictures } from '../src/content.ts';
import { swipeStep } from '../src/swipe.ts';
import { audioTranscript } from '../src/audio.ts';

assert.equal(pictures.length, 246);
assert.equal(new Set(pictures.map(p => p.id)).size, pictures.length);
for (const category of categories) {
  const items = pictures.filter(p => p.category === category.id);
  assert.equal(items.length, category.id === 'numbers' ? 100 : category.id === 'letters' ? 26 : 20);
  for (const item of items) {
    assert.ok(item.name && item.pronunciation && item.description);
    if (item.image) assert.ok(existsSync(`public${item.image}`), `Missing ${item.image}`);
    if (item.imageLarge) {
      assert.ok(existsSync(`public${item.imageLarge}`), `Missing ${item.imageLarge}`);
      assert.notEqual(item.image, item.imageLarge);
    }
  }
}
for (const [value, label] of [[1, '一'], [10, '十'], [11, '十一'], [20, '二十'], [99, '九十九'], [100, '一百']] as const) {
  assert.equal(chineseNumber(value), label);
}
assert.ok(existsSync('public/art/hero.webp'));
assert.equal(pictures.filter(p => p.imageLarge).length, 120);
assert.ok(pictures.every(p => p.category === 'numbers' || p.category === 'letters' || p.imageLarge));
assert.equal(swipeStep(-90, 12), 1);
assert.equal(swipeStep(90, 12), -1);
assert.equal(swipeStep(30, 0), 0);
assert.equal(swipeStep(80, 100), 0);
assert.equal(swipeStep(60, 40), 0);
assert.equal(audioTranscript(pictures.find(p => p.id === 'animals-01')!), '狮子。狮子有一圈蓬松的鬃毛，像戴着小围巾。');
assert.equal(audioTranscript(pictures.find(p => p.id === 'numbers-100')!), '一百');
assert.equal(audioTranscript(pictures.find(p => p.id === 'letters-A')!), 'A');
console.log('检查通过：8 个分类、246 张内容卡、全部插画和数字读法。');
