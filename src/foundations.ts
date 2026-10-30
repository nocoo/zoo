import type { ExpansionCard, ExpansionCategory } from './expansion.ts';

type Card = [id: string, name: string, pinyin: string, english: string, description: string, englishDescription: string];

const toCards = (rows: Card[]): ExpansionCard[] =>
  rows.map(([id, name, pronunciation, english, description, englishDescription]) => ({
    id, name, english, pronunciation, description, englishDescription,
  }));

export const foundationCategories: ExpansionCategory[] = [
  {
    id: 'colors',
    name: '认识颜色',
    kind: 'new',
    cards: toCards([
      ['colors-01', '红色', 'hóng sè', 'Red', '红色像小苹果一样鲜艳。', 'Red is bright like a little apple.'],
      ['colors-02', '黄色', 'huáng sè', 'Yellow', '黄色像小鸭子一样温暖。', 'Yellow is warm like a little duckling.'],
      ['colors-03', '蓝色', 'lán sè', 'Blue', '蓝色像天空和大海。', 'Blue is the color of the sky and the sea.'],
      ['colors-04', '绿色', 'lǜ sè', 'Green', '绿色像小草和树叶。', 'Green is the color of grass and leaves.'],
      ['colors-05', '橙色', 'chéng sè', 'Orange', '橙色像甜甜的橙子。', 'Orange is the color of a sweet orange.'],
      ['colors-06', '紫色', 'zǐ sè', 'Purple', '紫色像一串小葡萄。', 'Purple is like a little bunch of grapes.'],
      ['colors-07', '粉色', 'fěn sè', 'Pink', '粉色像软软的花瓣。', 'Pink is soft like flower petals.'],
      ['colors-08', '黑色', 'hēi sè', 'Black', '黑色像夜晚的天空。', 'Black is like the night sky.'],
      ['colors-09', '白色', 'bái sè', 'White', '白色像棉花和雪花。', 'White is like cotton and snowflakes.'],
      ['colors-10', '棕色', 'zōng sè', 'Brown', '棕色像大树的树干。', 'Brown is like the trunk of a big tree.'],
    ]),
  },
  {
    id: 'shapes',
    name: '认识形状',
    kind: 'new',
    cards: toCards([
      ['shapes-01', '圆形', 'yuán xíng', 'Circle', '圆形像皮球一样圆滚滚。', 'A circle is round like a ball.'],
      ['shapes-02', '正方形', 'zhèng fāng xíng', 'Square', '正方形四条边一样长。', 'A square has four sides the same length.'],
      ['shapes-03', '三角形', 'sān jiǎo xíng', 'Triangle', '三角形有三条边三个角。', 'A triangle has three sides and three corners.'],
      ['shapes-04', '长方形', 'cháng fāng xíng', 'Rectangle', '长方形有两组长边和短边。', 'A rectangle has two long sides and two short sides.'],
      ['shapes-05', '椭圆形', 'tuǒ yuán xíng', 'Oval', '椭圆形像鸡蛋一样。', 'An oval looks like an egg.'],
      ['shapes-06', '星形', 'xīng xíng', 'Star', '星形有五个尖尖的角。', 'A star has five pointed corners.'],
      ['shapes-07', '心形', 'xīn xíng', 'Heart', '心形像一颗爱心。', 'A heart shape looks like a loving heart.'],
      ['shapes-08', '菱形', 'líng xíng', 'Diamond', '菱形像小风筝。', 'A diamond shape looks like a little kite.'],
    ]),
  },
  {
    id: 'family',
    name: '我的家人',
    kind: 'new',
    cards: toCards([
      ['family-01', '妈妈', 'mā ma', 'Mom', '妈妈会抱抱我，也会陪我玩。', 'Mom gives hugs and plays with me.'],
      ['family-02', '爸爸', 'bà ba', 'Dad', '爸爸把我举得高高的。', 'Dad lifts me up high.'],
      ['family-03', '爷爷', 'yé ye', 'Grandpa', '爷爷牵着我的手慢慢走。', 'Grandpa holds my hand and walks slowly with me.'],
      ['family-04', '奶奶', 'nǎi nai', 'Grandma', "奶奶做的饭菜香香的。", "Grandma's cooking smells yummy."],
      ['family-05', '宝宝', 'bǎo bao', 'Baby', '宝宝小小的，大家都爱他。', 'The baby is little and everyone loves him.'],
      ['family-06', '哥哥', 'gē ge', 'Big brother', '哥哥牵着我的手，一起玩。', 'My big brother holds my hand and we play together.'],
      ['family-07', '姐姐', 'jiě jie', 'Big sister', '姐姐教我画画。', 'My big sister teaches me to draw.'],
    ]),
  },
];
