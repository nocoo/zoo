import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { categories, chineseNumber, numberPinyin, pictures } from '../src/content.ts';
import { englishNumber } from '../src/english.ts';
import { neighborImages } from '../src/neighbors.ts';
import { swipeStep } from '../src/swipe.ts';
import { audioTranscript, englishAudioTranscript } from '../src/audio.ts';

assert.equal(pictures.length, 176);
const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'));
assert.equal(manifest.name, '小小动物岛');
assert.equal(manifest.short_name.length, 5);
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, '/');
assert.match(readFileSync('index.html', 'utf8'), /<title>小小动物岛<\/title>/);
for (const [file, size] of [['/apple-touch-icon.png', 180], ...manifest.icons.map((icon: { src: string; sizes: string }) => [icon.src, Number(icon.sizes.split('x')[0])])] as [string, number][]) {
  const bytes = readFileSync(`public${file}`);
  assert.equal(bytes.readUInt32BE(16), size);
  assert.equal(bytes.readUInt32BE(20), size);
}
assert.equal(new Set(pictures.map(p => p.id)).size, pictures.length);
for (const category of categories) {
  const items = pictures.filter(p => p.category === category.id);
  assert.equal(items.length, category.id === 'numbers' ? 30 : category.id === 'letters' ? 26 : 20);
  for (const item of items) {
    assert.ok(item.name && item.pronunciation && item.description && item.english);
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
assert.ok(!pictures.some(p => p.category === 'numbers' && p.value! > 30));
assert.ok(existsSync('public/art/hero.webp'));
assert.equal(pictures.filter(p => p.imageLarge).length, 176);
assert.ok(pictures.every(p => p.image && p.imageLarge));
assert.equal(swipeStep(-90, 12), 1);
assert.equal(swipeStep(90, 12), -1);
assert.equal(swipeStep(30, 0), 0);
assert.equal(swipeStep(80, 100), 0);
assert.equal(swipeStep(60, 40), 0);
assert.equal(audioTranscript(pictures.find(p => p.id === 'animals-01')!), '狮子。狮子有一圈蓬松的鬃毛，像戴着小围巾。');
assert.equal(pictures.find(p => p.id === 'animals-01')!.englishDescription, 'The lion has a fluffy mane around his neck, like a little scarf.');
assert.equal(pictures.filter(p => p.englishDescription).length, 1);
assert.equal(englishAudioTranscript(pictures.find(p => p.id === 'animals-01')!), 'Lion. The lion has a fluffy mane around his neck, like a little scarf.');
assert.equal(englishAudioTranscript(pictures.find(p => p.id === 'letters-A')!), 'A');
assert.throws(() => englishAudioTranscript(pictures.find(p => p.id === 'animals-02')!), /Missing English explanation/);
assert.equal(audioTranscript(pictures.find(p => p.id === 'numbers-30')!), '三十');
assert.equal(audioTranscript(pictures.find(p => p.id === 'letters-A')!), 'A');
assert.equal(englishNumber(21), 'Twenty-one');
assert.equal(englishNumber(100), 'One hundred');
assert.equal(numberPinyin(99), 'jiǔ shí jiǔ');
assert.equal(numberPinyin(100), 'yī bǎi');
const animals = pictures.filter(p => p.category === 'animals');
assert.deepEqual(neighborImages(animals, animals[0].id), [19, 1, 18, 2].map(i => animals[i].imageLarge));
assert.deepEqual(neighborImages(animals.slice(0, 1), animals[0].id), []);
assert.deepEqual(neighborImages(animals.slice(0, 2), animals[0].id), [animals[1].imageLarge]);
assert.deepEqual(neighborImages([], 'missing'), []);
const numbers = pictures.filter(p => p.category === 'numbers');
assert.deepEqual(neighborImages(numbers, 'numbers-1'), [29, 1, 28, 2].map(i => numbers[i].imageLarge));
console.log('检查通过：8 个分类、176 张内容卡、全部插画和数字读法。');
