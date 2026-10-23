import type { ExpansionCard, ExpansionCategory } from './expansion.ts';

type Row = [id: string, name: string, english: string, pronunciation: string, description: string, englishDescription: string, group?: string];

const toCards = (rows: Row[]): ExpansionCard[] =>
  rows.map(([id, name, english, pronunciation, description, englishDescription, group]) => ({
    id, name, english, pronunciation, description, englishDescription, ...(group ? { group } : {}),
  }));

export const additionCategories: ExpansionCategory[] = [
  {
    id: 'animals',
    name: '动物朋友',
    kind: 'existing',
    cards: toCards([
      ['animals-30', '小鱼', 'Fish', 'xiǎo yú', '小鱼在水里游，尾巴一摆一摆。', 'A little fish swims in the water and wags its tail.', '水边伙伴'],
      ['animals-31', '青蛙', 'Frog', 'qīng wā', '青蛙蹲在荷叶上，跳起来又远又稳。', 'The frog sits on a lily pad and jumps far and steady.', '水边伙伴'],
      ['animals-32', '螃蟹', 'Crab', 'páng xiè', '螃蟹横着走路，举着两只大钳子。', 'The crab walks sideways and holds up two big claws.', '水边伙伴'],
      ['animals-33', '绵羊', 'Sheep', 'mián yáng', '绵羊的毛卷卷的，像一朵白云。', 'The sheep has curly wool like a little cloud.', '农场伙伴'],
      ['animals-34', '小鹿', 'Deer', 'xiǎo lù', '小鹿头上长着小角，跑起来很轻快。', 'The little deer has small antlers and runs lightly.', '森林草原'],
      ['animals-35', '刺猬', 'Hedgehog', 'cì wei', '刺猬背上长满小刺，遇到危险就缩成一团。', 'A hedgehog has little spines on its back and rolls up when it feels unsafe.', '森林草原'],
    ]),
  },
  {
    id: 'vegetables',
    name: '蔬菜',
    kind: 'existing',
    cards: toCards([
      ['vegetables-10', '蘑菇', 'Mushroom', 'mó gu', '蘑菇像一把小伞，有圆圆的伞盖。', 'A mushroom looks like a little umbrella with a round cap.'],
      ['vegetables-11', '豆角', 'Green beans', 'dòu jiǎo', '豆角长长的，里面有小小的豆子。', 'Green beans are long and have small beans inside.'],
      ['vegetables-12', '菠菜', 'Spinach', 'bō cài', '菠菜的叶子绿绿的，煮熟以后软软的。', 'Spinach has green leaves and turns soft when cooked.'],
      ['vegetables-13', '洋葱', 'Onion', 'yáng cōng', '洋葱一层一层包着，切开时有点辣眼睛。', 'An onion has layer after layer, and cutting it can make our eyes water.'],
    ]),
  },
  {
    id: 'food',
    name: '饭桌食物',
    kind: 'existing',
    cards: toCards([
      ['food-11', '肉', 'Meat', 'ròu', '肉煮熟了香香的，可以撕成小块。', 'Cooked meat smells good and can be torn into small pieces.'],
      ['food-12', '鱼肉', 'Fish', 'yú ròu', '鱼肉软软的，吃之前大人会帮我们把刺挑出来。', 'Fish is soft, and a grown-up takes out the bones before we eat.'],
      ['food-13', '汤', 'Soup', 'tāng', '汤盛在碗里，喝起来暖暖的。', 'Soup is served in a bowl and feels warm to drink.'],
      ['food-14', '饼干', 'Cracker', 'bǐng gān', '饼干小小的，咬一口嘎吱响。', 'A cracker is small and crunches when we bite it.'],
      ['food-15', '蛋糕', 'Cake', 'dàn gāo', '蛋糕软软的，上面抹着甜甜的奶油。', 'Cake is soft and topped with sweet cream.'],
      ['food-16', '糖果', 'Candy', 'táng guǒ', '糖果甜甜的，吃完要记得刷牙。', 'Candy is sweet, and we brush our teeth after eating it.'],
    ]),
  },
  {
    id: 'objects',
    name: '身边物品',
    kind: 'existing',
    cards: toCards([
      ['objects-32', '气球', 'Balloon', 'qì qiú', '气球鼓鼓的，一松手就往天上飞。', 'A balloon is puffy and flies up when we let go.'],
      ['objects-33', '风筝', 'Kite', 'fēng zheng', '风筝有一根长长的线，有风的时候能飞很高。', 'A kite has a long string and flies high when it is windy.'],
      ['objects-34', '蜡笔', 'Crayon', 'là bǐ', '蜡笔能画出彩色的线，盖好笔帽不容易干。', 'Crayons draw colorful lines, and putting the caps back keeps them from drying out.'],
      ['objects-35', '钥匙', 'Key', 'yào shi', '钥匙插进锁孔一转，门就开了。', 'A key goes into the lock and turns to open the door.'],
      ['objects-36', '枕头', 'Pillow', 'zhěn tou', '枕头软软的，睡觉的时候垫在头下面。', 'A pillow is soft and goes under our head when we sleep.'],
      ['objects-37', '扫把', 'Broom', 'sào bǎ', '扫把能把地上的碎屑扫到一起。', 'A broom sweeps the crumbs on the floor into a pile.'],
    ]),
  },
  {
    id: 'transport',
    name: '交通工具',
    kind: 'existing',
    cards: toCards([
      ['transport-11', '警车', 'Police car', 'jǐng chē', '警车会闪灯，提醒大家让一让。', 'A police car flashes its lights to remind everyone to make way.'],
      ['transport-12', '摩托车', 'Motorcycle', 'mó tuō chē', '摩托车有两个轮子，跑起来声音很响。', 'A motorcycle has two wheels and sounds loud when it goes.'],
      ['transport-13', '洒水车', 'Water truck', 'sǎ shuǐ chē', '洒水车一边开一边洒水，把路面冲干净。', 'A water truck sprays water as it drives and washes the road.'],
      ['transport-14', '垃圾车', 'Garbage truck', 'lā jī chē', '垃圾车把垃圾收走，让街道保持干净。', 'A garbage truck takes the rubbish away and keeps the street clean.'],
      ['transport-15', '热气球', 'Hot-air balloon', 'rè qì qiú', '热气球鼓得大大的，慢慢升上天空。', 'A hot-air balloon is big and round, and it rises slowly into the sky.'],
    ]),
  },
  {
    id: 'places',
    name: '一起出门',
    kind: 'existing',
    cards: toCards([
      ['places-09', '动物园', 'Zoo', 'dòng wù yuán', '动物园里有好多动物，要隔着栏杆看。', 'At the zoo we can see many animals from behind the railing.'],
      ['places-10', '海边', 'Seaside', 'hǎi biān', '海边有沙子和小浪花，可以光脚踩水。', 'At the seaside there is sand and gentle waves, and we can paddle barefoot.'],
      ['places-11', '餐厅', 'Restaurant', 'cān tīng', '餐厅里可以坐下来吃饭，服务员会端来饭菜。', 'In a restaurant we sit down to eat and the waiter brings the food.'],
      ['places-12', '理发店', 'Hair salon', 'lǐ fà diàn', '理发店可以剪头发，剪刀咔嚓咔嚓响。', 'At the hair salon we get a haircut, and the scissors go snip snip.'],
    ]),
  },
  {
    id: 'weather',
    name: '天气自然',
    kind: 'existing',
    cards: toCards([
      ['weather-26', '春天', 'Spring', 'chūn tiān', '春天花开了，小草从土里钻出来。', 'In spring the flowers open and the grass comes up.'],
      ['weather-27', '夏天', 'Summer', 'xià tiān', '夏天很热，可以吃西瓜、玩水。', 'Summer is hot, and we can eat watermelon and play with water.'],
      ['weather-28', '秋天', 'Autumn', 'qiū tiān', '秋天树叶变黄，一片一片落下来。', 'In autumn the leaves turn yellow and fall one by one.'],
      ['weather-29', '冬天', 'Winter', 'dōng tiān', '冬天很冷，出门要穿厚厚的衣服。', 'Winter is cold, and we wear thick clothes when we go out.'],
    ]),
  },
  {
    id: 'phrases',
    name: '开口说说',
    kind: 'existing',
    cards: toCards([
      ['phrases-30', '早上好', 'Good morning', 'zǎo shang hǎo', '早上见到大人，可以说一句早上好。', 'In the morning we can say good morning to a grown-up.'],
      ['phrases-31', '晚安', 'Good night', 'wǎn ān', '睡觉前轻轻说一句晚安。', 'Before sleep we say good night softly.'],
      ['phrases-32', '不客气', "You're welcome", 'bú kè qi', '别人说谢谢的时候，可以回一句不客气。', 'When someone says thank you, we can answer you are welcome.'],
      ['phrases-33', '我要上厕所', 'I need the toilet', 'wǒ yào shàng cè suǒ', '想上厕所的时候说出来，大人就能帮忙。', 'When we need the toilet, saying it lets a grown-up help.'],
      ['phrases-34', '我自己来', 'I will do it myself', 'wǒ zì jǐ lái', '想自己试一试的时候，可以说我自己来。', 'When we want to try alone, we can say I will do it myself.'],
      ['phrases-35', '等一下', 'Just a moment', 'děng yī xià', '还没做完的时候，可以说等一下。', 'When we are not finished yet, we can say just a moment.'],
      ['phrases-36', '再来一次', 'Again please', 'zài lái yī cì', '遇到喜欢的游戏，可以说再来一次。', 'For a game we enjoy, we can say again please.'],
      ['phrases-37', '小心', 'Careful', 'xiǎo xīn', '走路或者端水的时候，大人会说小心。', 'When we walk or carry water, a grown-up says careful.'],
    ]),
  },
];
