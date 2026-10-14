import assert from 'node:assert/strict';
import { pictures } from '../src/content.ts';
import { expansionCategories } from '../src/expansion.ts';

const expected = [
  { id: 'transport', name: '交通工具', kind: 'new', start: 1, names: ['小汽车', '公交车', '自行车', '火车', '地铁', '飞机', '轮船', '消防车', '救护车', '挖掘机'] },
  { id: 'vegetables', name: '蔬菜', kind: 'new', start: 1, names: ['胡萝卜', '黄瓜', '西红柿', '土豆', '南瓜', '白菜', '西兰花', '茄子', '玉米'] },
  { id: 'food', name: '饭桌食物', kind: 'new', start: 1, names: ['米饭', '面条', '馒头', '包子', '饺子', '面包', '鸡蛋', '豆腐', '粥', '牛奶'] },
  { id: 'places', name: '一起出门', kind: 'new', start: 1, names: ['公园', '超市', '菜市场', '医院', '车站', '图书馆', '幼儿园', '游乐场'] },
  { id: 'objects', name: '身边物品', kind: 'existing', start: 21, names: ['电脑', '电话', '冰箱', '洗衣机', '电风扇', '吸尘器', '台灯', '沙发', '镜子', '梳子', '被子'] },
  { id: 'animals', name: '动物朋友', kind: 'existing', start: 21, names: ['小猪', '小鸡', '鹅', '蝴蝶', '蜗牛', '蚂蚁', '蜜蜂', '瓢虫', '毛毛虫'] },
  { id: 'phrases', name: '开口说说', kind: 'existing', start: 21, names: ['跳一跳', '拍拍手', '蹲下来', '我来试试', '帮帮我', '我不要', '我很开心', '我有点害怕', '我想休息'] },
  { id: 'weather', name: '天气自然', kind: 'existing', start: 21, names: ['大海', '小溪', '瀑布', '沙滩', '草地'] },
  { id: 'fruits', name: '缤纷水果', kind: 'existing', start: 21, names: ['橘子', '柚子', '杏', '李子', '山竹', '杨梅'] },
] as const;

assert.equal(pictures.length, 176);
assert.equal(expansionCategories.length, expected.length);

const expansionCards = expansionCategories.flatMap(category => category.cards);
const expansionIds: string[] = [];
const expansionNames: string[] = [];
const fields = ['id', 'name', 'english', 'pronunciation', 'description', 'englishDescription'] as const;

for (const [index, spec] of expected.entries()) {
  const category = expansionCategories[index];
  assert.equal(category.id, spec.id);
  assert.equal(category.name, spec.name);
  assert.equal(category.kind, spec.kind);
  assert.equal(category.cards.length, spec.names.length);
  for (const [cardIndex, name] of spec.names.entries()) {
    const card = category.cards[cardIndex];
    assert.equal(card.id, `${spec.id}-${String(spec.start + cardIndex).padStart(2, '0')}`);
    assert.equal(card.name, name);
    for (const field of fields) {
      assert.equal(typeof card[field], 'string');
      assert.ok(card[field].trim(), `${card.id} ${field}`);
    }
    expansionIds.push(card.id);
    expansionNames.push(card.name);
  }
}

assert.equal(expansionCards.length, 77);
assert.equal(expansionIds.length, 77);
assert.equal(new Set(expansionIds).size, 77);
assert.equal(new Set(expansionNames).size, 77);
assert.equal(expansionCategories.filter(category => category.kind === 'new').flatMap(category => category.cards).length, 37);
assert.equal(expansionCategories.filter(category => category.kind === 'existing').flatMap(category => category.cards).length, 40);

const activeIds = new Set(pictures.map(picture => picture.id));
const activeNames = new Set(pictures.map(picture => picture.name));
assert.equal(activeIds.size, 176);
for (const id of expansionIds) assert.ok(!activeIds.has(id), id);
for (const name of expansionNames) assert.ok(!activeNames.has(name), name);
assert.equal(pictures.length, 176);

console.log('检查通过：77 张扩展草稿，与 176 张正式内容互不重叠。');
