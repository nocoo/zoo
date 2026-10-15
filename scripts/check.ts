import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { animalGroups, categories, chineseNumber, numberPinyin, pictures } from '../src/content.ts';
import { englishNumber } from '../src/english.ts';
import { neighborImages } from '../src/neighbors.ts';
import { swipeStep } from '../src/swipe.ts';
import { audioTranscript, englishAudioTranscript, edgeEnglishAudioTranscript } from '../src/audio.ts';
import { shuffle } from '../src/shuffle.ts';
import './check-expansion.ts';
import './check-expansion-media.mjs';

assert.equal(pictures.length, 253);
assert.equal(categories.length, 12);
const counts = { animals: 29, numbers: 30, letters: 26, hanzi: 20, phrases: 29, weather: 25, objects: 31, fruits: 26, transport: 10, vegetables: 9, food: 10, places: 8 };
const media = JSON.parse(readFileSync('src/media.json', 'utf8'));
assert.equal(Object.keys(media.audio).length, 253);
assert.equal(Object.keys(media.transcripts).length, 253);
assert.equal(Object.keys(media.images).length, 506);
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
  assert.equal(items.length, counts[category.id]);
  for (const item of items) {
    assert.ok(item.name && item.pronunciation && item.description && item.english && item.englishDescription);
    assert.equal(englishAudioTranscript(item), item.category === 'letters' ? item.name : `${item.english}. ${item.englishDescription}`);
    for (const path of [item.image, item.imageLarge]) {
      assert.ok(existsSync(`public${path}`), `Missing ${path}`);
      assert.ok(media.images[path].startsWith(`${path}?v=`));
    }
    for (const language of ['zh', 'en']) {
      const url = media.audio[item.id][language];
      assert.ok(existsSync(`public${url.split('?')[0]}`), `Missing ${url}`);
      assert.equal(media.transcripts[item.id][language], language === 'zh' ? audioTranscript(item) :
        url.startsWith('/audio/') ? englishAudioTranscript(item) : edgeEnglishAudioTranscript(item));
    }
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
assert.equal(pictures.filter(p => p.imageLarge).length, 253);
assert.ok(pictures.every(p => p.image && p.imageLarge));
assert.equal(swipeStep(-90, 12), 1);
assert.equal(swipeStep(90, 12), -1);
assert.equal(swipeStep(30, 0), 0);
assert.equal(swipeStep(80, 100), 0);
assert.equal(swipeStep(60, 40), 0);
assert.equal(audioTranscript(pictures.find(p => p.id === 'animals-01')!), '狮子。狮子有一圈蓬松的鬃毛，像戴着小围巾。');
assert.equal(pictures.find(p => p.id === 'animals-01')!.englishDescription, 'The lion has a fluffy mane around his neck, like a little scarf.');
assert.equal(pictures.filter(p => p.englishDescription).length, 253);
assert.equal(englishAudioTranscript(pictures.find(p => p.id === 'animals-01')!), 'Lion. The lion has a fluffy mane around his neck, like a little scarf.');
assert.equal(englishAudioTranscript(pictures.find(p => p.id === 'letters-A')!), 'A');
assert.equal(englishAudioTranscript(pictures.find(p => p.id === 'animals-02')!), 'Panda. The panda has a black and white coat and loves to eat bamboo.');
assert.equal(audioTranscript(pictures.find(p => p.id === 'numbers-30')!), '三十');
assert.equal(audioTranscript(pictures.find(p => p.id === 'letters-A')!), 'A');
assert.equal(englishNumber(21), 'Twenty-one');
assert.equal(englishNumber(100), 'One hundred');
assert.equal(numberPinyin(99), 'jiǔ shí jiǔ');
assert.equal(numberPinyin(100), 'yī bǎi');
const animals = pictures.filter(p => p.category === 'animals');
assert.ok(animals.every(picture => animalGroups.slice(1).includes(picture.group!)));
assert.deepEqual(animalGroups.slice(1).map(group => animals.filter(p => p.group === group).length), [12, 7, 4, 6]);
for (const category of categories) {
  const items = pictures.filter(p => p.category === category.id);
  assert.deepEqual(neighborImages(items, items[0].id), [items.length - 1, 1, items.length - 2, 2].map(i => items[i].imageLarge));
}
assert.deepEqual(neighborImages(animals.slice(0, 1), animals[0].id), []);
assert.deepEqual(neighborImages(animals.slice(0, 2), animals[0].id), [animals[1].imageLarge]);
assert.deepEqual(neighborImages([], 'missing'), []);
const numbers = pictures.filter(p => p.category === 'numbers');
assert.deepEqual(neighborImages(numbers, 'numbers-1'), [29, 1, 28, 2].map(i => numbers[i].imageLarge));
const originalRandom = Math.random;
try {
  Math.random = () => 0;
  const source = [1, 2, 3, 4];
  assert.deepEqual(shuffle(source), [2, 3, 4, 1]);
  assert.deepEqual(source, [1, 2, 3, 4]);
  assert.deepEqual(shuffle([]), []);
  assert.deepEqual(shuffle([1]), [1]);
  const shuffled = shuffle(animals);
  assert.equal(new Set(shuffled).size, animals.length);
  assert.deepEqual(new Set(shuffled), new Set(animals));
  assert.deepEqual(neighborImages(shuffled, shuffled[0].id), [28, 1, 27, 2].map(i => shuffled[i].imageLarge));
} finally {
  Math.random = originalRandom;
}
console.log('检查通过：12 个分类、253 张内容卡、双语媒体、全部插画和数字读法。');
