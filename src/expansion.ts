import type { CategoryId } from './content.ts';

export type ExpansionCard = {
  id: string;
  name: string;
  english: string;
  pronunciation: string;
  description: string;
  englishDescription: string;
  group?: string;
};

export type ExpansionCategory = {
  id: CategoryId;
  name: string;
  kind: 'new' | 'existing';
  cards: ExpansionCard[];
};

export const expansionCategories: ExpansionCategory[] = [
  {
    id: 'transport',
    name: '交通工具',
    kind: 'new',
    cards: [
      { id: 'transport-01', name: '小汽车', english: 'Car', pronunciation: 'xiǎo qì chē', description: '小汽车有四个轮子，载着我们出门。', englishDescription: 'A car has four wheels and can take us out.' },
      { id: 'transport-02', name: '公交车', english: 'Bus', pronunciation: 'gōng jiāo chē', description: '公交车长长的，停下来让大家上车。', englishDescription: 'A bus is long and stops so people can get on.' },
      { id: 'transport-03', name: '自行车', english: 'Bicycle', pronunciation: 'zì xíng chē', description: '自行车有两个轮子，脚踩踏板就会走。', englishDescription: 'A bicycle has two wheels and moves when we pedal.' },
      { id: 'transport-04', name: '火车', english: 'Train', pronunciation: 'huǒ chē', description: '火车一节连着一节，沿着铁轨往前开。', englishDescription: 'A train is cars linked together, rolling along the tracks.' },
      { id: 'transport-05', name: '地铁', english: 'Subway', pronunciation: 'dì tiě', description: '地铁在地下跑，到站就会打开车门。', englishDescription: 'A subway train runs underground and opens its doors at the station.' },
      { id: 'transport-06', name: '飞机', english: 'Airplane', pronunciation: 'fēi jī', description: '飞机有大大的翅膀，能飞上高高的天空。', englishDescription: 'An airplane has big wings and flies high in the sky.' },
      { id: 'transport-07', name: '轮船', english: 'Ship', pronunciation: 'lún chuán', description: '轮船大大的，在水面上慢慢往前走。', englishDescription: 'A ship is big and moves slowly on the water.' },
      { id: 'transport-08', name: '消防车', english: 'Fire truck', pronunciation: 'xiāo fáng chē', description: '消防车红红的，带着长长的水管。', englishDescription: 'A fire truck is red and carries long hoses.' },
      { id: 'transport-09', name: '救护车', english: 'Ambulance', pronunciation: 'jiù hù chē', description: '救护车白白的，把需要帮助的人送到医院。', englishDescription: 'An ambulance is white and takes people who need help to the hospital.' },
      { id: 'transport-10', name: '挖掘机', english: 'Excavator', pronunciation: 'wā jué jī', description: '挖掘机有长长的铁手臂，可以挖土。', englishDescription: 'An excavator has a long metal arm that can dig dirt.' },
    ],
  },
  {
    id: 'vegetables',
    name: '蔬菜',
    kind: 'new',
    cards: [
      { id: 'vegetables-01', name: '胡萝卜', english: 'Carrot', pronunciation: 'hú luó bo', description: '胡萝卜橙橙的，长得像一根小棍子。', englishDescription: 'A carrot is orange and shaped like a little stick.' },
      { id: 'vegetables-02', name: '黄瓜', english: 'Cucumber', pronunciation: 'huáng guā', description: '黄瓜绿绿长长的，咬一口清清脆脆。', englishDescription: 'A cucumber is green and long, and it tastes cool and crunchy.' },
      { id: 'vegetables-03', name: '西红柿', english: 'Tomato', pronunciation: 'xī hóng shì', description: '西红柿圆圆红红的，里面有小小的籽。', englishDescription: 'A tomato is round and red, with tiny seeds inside.' },
      { id: 'vegetables-04', name: '土豆', english: 'Potato', pronunciation: 'tǔ dòu', description: '土豆圆圆的，外皮浅棕色，做熟了软软的。', englishDescription: 'A potato has light brown skin and turns soft when it is cooked.' },
      { id: 'vegetables-05', name: '南瓜', english: 'Pumpkin', pronunciation: 'nán guā', description: '南瓜圆圆的，穿着橙橙的厚外衣。', englishDescription: 'A pumpkin is round with thick orange skin.' },
      { id: 'vegetables-06', name: '白菜', english: 'Chinese cabbage', pronunciation: 'bái cài', description: '白菜叶子一层一层，白白的帮，绿绿的叶。', englishDescription: 'Chinese cabbage has layered leaves with white stems and green tops.' },
      { id: 'vegetables-07', name: '西兰花', english: 'Broccoli', pronunciation: 'xī lán huā', description: '西兰花绿绿的，头顶像一棵小小树。', englishDescription: 'Broccoli is green, and the top looks like a tiny tree.' },
      { id: 'vegetables-08', name: '茄子', english: 'Eggplant', pronunciation: 'qié zi', description: '茄子紫亮紫亮，身子长长的。', englishDescription: 'An eggplant is shiny purple and has a long body.' },
      { id: 'vegetables-09', name: '玉米', english: 'Corn', pronunciation: 'yù mǐ', description: '玉米金黄金黄，一颗颗玉米粒排得齐齐的。', englishDescription: 'Corn is golden, with kernels lined up in neat rows.' },
    ],
  },
  {
    id: 'food',
    name: '饭桌食物',
    kind: 'new',
    cards: [
      { id: 'food-01', name: '米饭', english: 'Rice', pronunciation: 'mǐ fàn', description: '米饭白白的，一粒一粒盛在小碗里。', englishDescription: 'Rice is white, with little grains served in a bowl.' },
      { id: 'food-02', name: '面条', english: 'Noodles', pronunciation: 'miàn tiáo', description: '面条长长细细的，盛在碗里热热的。', englishDescription: 'Noodles are long and thin, served warm in a bowl.' },
      { id: 'food-03', name: '馒头', english: 'Steamed bun', pronunciation: 'mán tou', description: '馒头白白软软，圆圆的，里面没有馅。', englishDescription: 'A steamed bun is white and soft, with no filling inside.' },
      { id: 'food-04', name: '包子', english: 'Bao', pronunciation: 'bāo zi', description: '包子圆圆鼓鼓的，里面藏着香香的馅。', englishDescription: 'A bao is round and puffy, with a tasty filling inside.' },
      { id: 'food-05', name: '饺子', english: 'Dumpling', pronunciation: 'jiǎo zi', description: '饺子像小口袋，薄皮包着馅。', englishDescription: 'A dumpling is a little pocket with filling inside a thin skin.' },
      { id: 'food-06', name: '面包', english: 'Bread', pronunciation: 'miàn bāo', description: '面包松松软软，可以撕成小块。', englishDescription: 'Bread is soft and fluffy, and we can tear off a little piece.' },
      { id: 'food-07', name: '鸡蛋', english: 'Egg', pronunciation: 'jī dàn', description: '鸡蛋椭圆椭圆的，煮熟剥开有蛋白和蛋黄。', englishDescription: 'A cooked egg is oval; peel it to find the white and the yellow yolk.' },
      { id: 'food-08', name: '豆腐', english: 'Tofu', pronunciation: 'dòu fu', description: '豆腐白白嫩嫩，一晃一晃软软的。', englishDescription: 'Tofu is white and tender, and it feels soft on the spoon.' },
      { id: 'food-09', name: '粥', english: 'Rice porridge', pronunciation: 'zhōu', description: '米加水慢慢煮，就变成了软软稠稠的粥。', englishDescription: 'Rice porridge is rice cooked until it is very soft.' },
      { id: 'food-10', name: '牛奶', english: 'Milk', pronunciation: 'niú nǎi', description: '牛奶白白的，倒进杯子里小口喝。', englishDescription: 'Milk is white. Pour it into a cup and take little sips.' },
    ],
  },
  {
    id: 'places',
    name: '一起出门',
    kind: 'new',
    cards: [
      { id: 'places-01', name: '公园', english: 'Park', pronunciation: 'gōng yuán', description: '公园里有树和小路，还有可以玩的空地。', englishDescription: 'A park has trees, paths, and open space to play.' },
      { id: 'places-02', name: '超市', english: 'Supermarket', pronunciation: 'chāo shì', description: '超市里一排排货架，装着吃的和用的。', englishDescription: 'A supermarket has long shelves of food and things we use at home.' },
      { id: 'places-03', name: '菜市场', english: 'Food market', pronunciation: 'cài shì chǎng', description: '菜市场很热闹，摊上摆着新鲜的菜。', englishDescription: 'A food market is busy, with stalls of fresh vegetables.' },
      { id: 'places-04', name: '医院', english: 'Hospital', pronunciation: 'yī yuàn', description: '医院是医生工作的地方，楼里有安静的走廊。', englishDescription: 'A hospital is where doctors work, with quiet hallways inside.' },
      { id: 'places-05', name: '车站', english: 'Station', pronunciation: 'chē zhàn', description: '车站是等车的地方，车来了再和大人上车。', englishDescription: 'A station is where we wait, then get on with a grown-up.' },
      { id: 'places-06', name: '图书馆', english: 'Library', pronunciation: 'tú shū guǎn', description: '图书馆里有好多书，我们可以轻轻地看。', englishDescription: 'A library has lots of books, and we can look at them quietly.' },
      { id: 'places-07', name: '幼儿园', english: 'Kindergarten', pronunciation: 'yòu ér yuán', description: '幼儿园里有小朋友，大家一起玩、听故事。', englishDescription: 'Kindergarten has little friends who play and listen to stories together.' },
      { id: 'places-08', name: '游乐场', english: 'Amusement park', pronunciation: 'yóu lè chǎng', description: '游乐场里有旋转的小设施，灯亮亮的很好看。', englishDescription: 'An amusement park has little rides and bright lights to look at with a grown-up.' },
    ],
  },
  {
    id: 'objects',
    name: '身边物品',
    kind: 'existing',
    cards: [
      { id: 'objects-21', name: '电脑', english: 'Computer', pronunciation: 'diàn nǎo', description: '电脑有亮亮的屏幕，上面会显示图画。', englishDescription: 'A computer has a bright screen that can show pictures.' },
      { id: 'objects-22', name: '电话', english: 'Phone', pronunciation: 'diàn huà', description: '电话可以传来声音，让我们和远处的人说话。', englishDescription: 'A phone carries voices so we can talk with someone far away.' },
      { id: 'objects-23', name: '冰箱', english: 'Refrigerator', pronunciation: 'bīng xiāng', description: '冰箱里面凉凉的，可以把食物放进去保鲜。', englishDescription: 'A refrigerator is cool inside and keeps food fresh.' },
      { id: 'objects-24', name: '洗衣机', english: 'Washing machine', pronunciation: 'xǐ yī jī', description: '洗衣机转动起来，衣服在水里转圈圈。', englishDescription: 'A washing machine turns, and the clothes spin around in the water.' },
      { id: 'objects-25', name: '电风扇', english: 'Fan', pronunciation: 'diàn fēng shàn', description: '电风扇的叶子转起来，送来一阵凉风。', englishDescription: "A fan's blades spin and send a cool breeze." },
      { id: 'objects-26', name: '吸尘器', english: 'Vacuum cleaner', pronunciation: 'xī chén qì', description: '吸尘器嗡嗡响，把地上的灰尘吸进去。', englishDescription: 'A vacuum cleaner hums and sucks up dust from the floor.' },
      { id: 'objects-27', name: '台灯', english: 'Lamp', pronunciation: 'tái dēng', description: '台灯站在桌子上，亮起来光是柔柔的。', englishDescription: 'A lamp stands on the table and gives a soft light.' },
      { id: 'objects-28', name: '沙发', english: 'Sofa', pronunciation: 'shā fā', description: '沙发软软的，坐上去可以靠一靠。', englishDescription: 'A sofa is soft, and we can sit down and lean back.' },
      { id: 'objects-29', name: '镜子', english: 'Mirror', pronunciation: 'jìng zi', description: '镜子亮亮平平的，可以看见自己的小脸。', englishDescription: 'A mirror is shiny and flat, and we can see our little face in it.' },
      { id: 'objects-30', name: '梳子', english: 'Comb', pronunciation: 'shū zi', description: '梳子有一排细齿，可以轻轻梳头发。', englishDescription: 'A comb has a row of thin teeth and can gently smooth hair.' },
      { id: 'objects-31', name: '被子', english: 'Blanket', pronunciation: 'bèi zi', description: '被子软软厚厚的，盖在身上暖暖的。', englishDescription: 'A blanket is soft and thick, and it keeps us warm.' },
    ],
  },
  {
    id: 'animals',
    name: '动物朋友',
    kind: 'existing',
    cards: [
      { id: 'animals-21', group: '农场伙伴', name: '小猪', english: 'Pig', pronunciation: 'xiǎo zhū', description: '小猪的鼻子圆圆的，身上粉粉的，会哼哼叫。', englishDescription: 'A pig has a round nose and a pink body, and it says oink.' },
      { id: 'animals-22', group: '农场伙伴', name: '小鸡', english: 'Chick', pronunciation: 'xiǎo jī', description: '小鸡圆滚滚的，身上是软软的黄羽毛，会唧唧叫。', englishDescription: 'A chick is round and fluffy, with soft yellow down, and it says peep.' },
      { id: 'animals-23', group: '农场伙伴', name: '鹅', english: 'Goose', pronunciation: 'é', description: '鹅的脖子长长的，走路一摇一摆。', englishDescription: 'A goose has a long neck and waddles as it walks.' },
      { id: 'animals-24', group: '花园小伙伴', name: '蝴蝶', english: 'Butterfly', pronunciation: 'hú dié', description: '蝴蝶有两对翅膀，会在花旁边轻轻飞。', englishDescription: 'A butterfly has two pairs of wings and flutters beside the flowers.' },
      { id: 'animals-25', group: '花园小伙伴', name: '蜗牛', english: 'Snail', pronunciation: 'wō niú', description: '蜗牛背上顶着小壳，走起路来慢慢的。', englishDescription: 'A snail carries a little shell on its back and moves very slowly.' },
      { id: 'animals-26', group: '花园小伙伴', name: '蚂蚁', english: 'Ant', pronunciation: 'mǎ yǐ', description: '蚂蚁小小的，常常排着队往前走。', englishDescription: 'Ants are tiny and often walk forward in a line.' },
      { id: 'animals-27', group: '花园小伙伴', name: '蜜蜂', english: 'Bee', pronunciation: 'mì fēng', description: '蜜蜂嗡嗡飞，停在花上采花蜜。', englishDescription: 'A bee buzzes and stops on flowers to gather nectar.' },
      { id: 'animals-28', group: '花园小伙伴', name: '瓢虫', english: 'Ladybug', pronunciation: 'piáo chóng', description: '瓢虫圆圆的，背上常有黑色小点点。', englishDescription: 'A ladybug is round, and its back often has little black spots.' },
      { id: 'animals-29', group: '花园小伙伴', name: '毛毛虫', english: 'Caterpillar', pronunciation: 'máo mao chóng', description: '毛毛虫圆滚滚的，一拱一拱地往前走。', englishDescription: 'A caterpillar is plump and scooches forward in little arches.' },
    ],
  },
  {
    id: 'phrases',
    name: '开口说说',
    kind: 'existing',
    cards: [
      { id: 'phrases-21', name: '跳一跳', english: 'Jump', pronunciation: 'tiào yi tiào', description: '我们一起跳一跳。', englishDescription: "Let's take a little jump together." },
      { id: 'phrases-22', name: '拍拍手', english: 'Clap your hands', pronunciation: 'pāi pai shǒu', description: '大家拍拍手。', englishDescription: "Let's clap our hands." },
      { id: 'phrases-23', name: '蹲下来', english: 'Squat down', pronunciation: 'dūn xia lai', description: '我们慢慢蹲下来。', englishDescription: "Let's squat down slowly." },
      { id: 'phrases-24', name: '我来试试', english: 'Let me try', pronunciation: 'wǒ lái shì shi', description: '我来试试。', englishDescription: 'Let me try.' },
      { id: 'phrases-25', name: '帮帮我', english: 'Help me', pronunciation: 'bāng bang wǒ', description: '请帮帮我。', englishDescription: 'Please help me.' },
      { id: 'phrases-26', name: '我不要', english: "I don't want this", pronunciation: 'wǒ bú yào', description: '我不要这个。', englishDescription: "I don't want this." },
      { id: 'phrases-27', name: '我很开心', english: 'I am happy', pronunciation: 'wǒ hěn kāi xīn', description: '我很开心。', englishDescription: 'I am so happy.' },
      { id: 'phrases-28', name: '我有点害怕', english: 'I am a little scared', pronunciation: 'wǒ yǒu diǎn hài pà', description: '我有点害怕。', englishDescription: 'I feel a little scared.' },
      { id: 'phrases-29', name: '我想休息', english: 'I want to rest', pronunciation: 'wǒ xiǎng xiū xi', description: '我想休息一下。', englishDescription: 'I would like to rest.' },
    ],
  },
  {
    id: 'weather',
    name: '天气自然',
    kind: 'existing',
    cards: [
      { id: 'weather-21', name: '大海', english: 'Ocean', pronunciation: 'dà hǎi', description: '大海蓝蓝的，浪花一层层拍在岸边。', englishDescription: 'The ocean is blue, and little waves tap the shore.' },
      { id: 'weather-22', name: '小溪', english: 'Stream', pronunciation: 'xiǎo xī', description: '小溪的水绕过石头，轻轻地往前流。', englishDescription: 'A stream flows gently around the stones.' },
      { id: 'weather-23', name: '瀑布', english: 'Waterfall', pronunciation: 'pù bù', description: '瀑布从高处落下来，溅起白白的水花。', englishDescription: 'A waterfall pours down from high up and makes white splashes.' },
      { id: 'weather-24', name: '沙滩', english: 'Beach', pronunciation: 'shā tān', description: '沙滩软软的，细沙子可以漏过手指缝。', englishDescription: 'A beach has soft sand that can slip through your fingers.' },
      { id: 'weather-25', name: '草地', english: 'Grass', pronunciation: 'cǎo dì', description: '草地绿绿软软的，小草一棵挨着一棵。', englishDescription: 'The grass is green and soft, with little blades standing side by side.' },
    ],
  },
  {
    id: 'fruits',
    name: '缤纷水果',
    kind: 'existing',
    cards: [
      { id: 'fruits-21', name: '橘子', english: 'Mandarin orange', pronunciation: 'jú zi', description: '橘子小小的，皮下面是一瓣一瓣的果肉。', englishDescription: 'A mandarin orange is small, with juicy segments under its peel.' },
      { id: 'fruits-22', name: '柚子', english: 'Pomelo', pronunciation: 'yòu zi', description: '柚子圆圆大大的，皮厚厚的，果肉一瓣一瓣。', englishDescription: 'A pomelo is big and round, with a thick peel and juicy segments.' },
      { id: 'fruits-23', name: '杏', english: 'Apricot', pronunciation: 'xìng', description: '杏圆圆的，熟了黄黄的，中间有一颗硬核。', englishDescription: 'An apricot is round and turns yellow when ripe, with a hard pit in the middle.' },
      { id: 'fruits-24', name: '李子', english: 'Plum', pronunciation: 'lǐ zi', description: '李子圆圆的，皮光滑，咬一口汁水很多。', englishDescription: 'A plum is round and smooth, and it is very juicy inside.' },
      { id: 'fruits-25', name: '山竹', english: 'Mangosteen', pronunciation: 'shān zhú', description: '山竹紫紫的，剥开厚皮是白白的果肉。', englishDescription: 'A mangosteen is purple; under the thick peel, the fruit is white.' },
      { id: 'fruits-26', name: '杨梅', english: 'Bayberry', pronunciation: 'yáng méi', description: '杨梅红红的，表面一颗颗小凸起，酸酸甜甜。', englishDescription: 'A bayberry is red with a bumpy surface, and it tastes sweet and tart.' },
    ],
  },
];
