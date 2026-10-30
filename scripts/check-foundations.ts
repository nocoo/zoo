import assert from 'node:assert/strict';
import { pictures } from '../src/content.ts';
import { foundationCategories } from '../src/foundations.ts';

const expected = [
  { id: 'colors', name: '认识颜色', names: ['红色', '黄色', '蓝色', '绿色', '橙色', '紫色', '粉色', '黑色', '白色', '棕色'], english: ['Red', 'Yellow', 'Blue', 'Green', 'Orange', 'Purple', 'Pink', 'Black', 'White', 'Brown'] },
  { id: 'shapes', name: '认识形状', names: ['圆形', '正方形', '三角形', '长方形', '椭圆形', '星形', '心形', '菱形'], english: ['Circle', 'Square', 'Triangle', 'Rectangle', 'Oval', 'Star', 'Heart', 'Diamond'] },
  { id: 'family', name: '我的家人', names: ['妈妈', '爸爸', '爷爷', '奶奶', '宝宝', '哥哥', '姐姐'], english: ['Mom', 'Dad', 'Grandpa', 'Grandma', 'Baby', 'Big brother', 'Big sister'] },
] as const;

assert.equal(foundationCategories.length, expected.length);

const fields = ['id', 'name', 'english', 'pronunciation', 'description', 'englishDescription'] as const;
const ids: string[] = [];

for (const [index, spec] of expected.entries()) {
  const category = foundationCategories[index];
  assert.equal(category.id, spec.id);
  assert.equal(category.name, spec.name);
  assert.equal(category.kind, 'new');
  assert.equal(category.cards.length, spec.names.length);
  for (const [position, card] of category.cards.entries()) {
    for (const field of fields) assert.ok(card[field], `${card.id} missing ${field}`);
    assert.equal(card.id, `${spec.id}-${String(position + 1).padStart(2, '0')}`);
    assert.equal(card.name, spec.names[position]);
    assert.equal(card.english, spec.english[position]);
    assert.match(card.pronunciation, /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü ]+$/);
    assert.ok(card.description.endsWith('。'), `${card.id} description must end with a full stop`);
    assert.ok(card.englishDescription.endsWith('.'), `${card.id} English description must end with a full stop`);
    ids.push(card.id);
  }
}

assert.equal(ids.length, 25);
assert.equal(new Set(ids).size, 25);

for (const identifier of ids) {
  const picture = pictures.find(item => item.id === identifier);
  assert.ok(picture, `${identifier} missing from pictures`);
  assert.equal(picture.image, `/art/foundations/${identifier}-thumb.webp`);
  assert.equal(picture.imageLarge, `/art/foundations/${identifier}-full.webp`);
  assert.equal(picture.category, identifier.split('-')[0]);
}

assert.deepEqual(
  pictures.filter(item => ['colors', 'shapes', 'family'].includes(item.category)).map(item => item.id),
  ids,
);

console.log('检查通过：3 个基础分类、25 张认知卡、字段与图片路径完整。');
