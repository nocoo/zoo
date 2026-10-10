import { englishLabel, englishNumber } from './english.ts';

export type CategoryId = 'animals' | 'numbers' | 'letters' | 'hanzi' | 'phrases' | 'weather' | 'objects' | 'fruits';
export type Picture = {
  id: string;
  category: CategoryId;
  name: string;
  english: string;
  pronunciation: string;
  description: string;
  image?: string;
  imageLarge?: string;
  group?: string;
  value?: number;
  example?: string;
};

export const categories: { id: CategoryId; name: string; subtitle: string; title: string; hint: string; tone: string }[] = [
  { id: 'animals', name: '动物朋友', subtitle: '认识可爱的新朋友', title: '今天，认识哪位动物朋友？', hint: '点一点小动物，听听它的名字吧', tone: 'mint' },
  { id: 'numbers', name: '认识数字', subtitle: '一起数一数', title: '一、二、三，一起数一数！', hint: '从 1 到 100，慢慢发现数字的秘密', tone: 'peach' },
  { id: 'letters', name: '认识字母', subtitle: '字母也有好朋友', title: '和 ABC 交个朋友吧！', hint: '26 个字母，看看大写和小写有什么不同', tone: 'blue' },
  { id: 'hanzi', name: '汉字宝宝', subtitle: '小小汉字大世界', title: '在图画里，遇见汉字宝宝', hint: '看一看、指一指，不用急着记住哦', tone: 'rose' },
  { id: 'phrases', name: '开口说说', subtitle: '每天学说一句话', title: '把小小的想法，说出来', hint: '和爸爸妈妈一起，试着说一说', tone: 'yellow' },
  { id: 'weather', name: '天气自然', subtitle: '抬头看看天空', title: '今天的天空，是什么样子？', hint: '风、雨、阳光，都是大自然的礼物', tone: 'blue' },
  { id: 'objects', name: '身边物品', subtitle: '发现生活小宝藏', title: '这些东西，你在哪里见过？', hint: '找一找，家里也有它们吗', tone: 'peach' },
  { id: 'fruits', name: '缤纷水果', subtitle: '甜甜的彩虹味道', title: '水果篮里，装着小彩虹', hint: '认一认颜色，再说说你喜欢哪一个', tone: 'rose' },
];

type Row = [string, string, string, string?];
const rows: Record<Exclude<CategoryId, 'numbers' | 'letters'>, Row[]> = {
  animals: [
    ['狮子', 'shī zi', '狮子有一圈蓬松的鬃毛，像戴着小围巾。', '森林草原'],
    ['熊猫', 'xióng māo', '熊猫穿着黑白衣服，最爱吃竹子。', '森林草原'],
    ['兔子', 'tù zi', '兔子的耳朵长长的，蹦蹦跳跳真可爱。', '农场伙伴'],
    ['大象', 'dà xiàng', '大象的鼻子长长的，可以卷起食物。', '森林草原'],
    ['长颈鹿', 'cháng jǐng lù', '长颈鹿的脖子长长的，能吃到高处的树叶。', '森林草原'],
    ['小猫', 'xiǎo māo', '小猫喵喵叫，嘴边长着细细的胡须。', '农场伙伴'],
    ['小狗', 'xiǎo gǒu', '小狗汪汪叫，摇摇尾巴来问好。', '农场伙伴'],
    ['老虎', 'lǎo hǔ', '老虎的身上有一道道黑色的条纹。', '森林草原'],
    ['猴子', 'hóu zi', '猴子会爬树，用小手抓住树枝。', '森林草原'],
    ['斑马', 'bān mǎ', '斑马穿着黑白条纹的衣服。', '森林草原'],
    ['小熊', 'xiǎo xióng', '小熊的身体胖胖的，耳朵圆圆的。', '森林草原'],
    ['狐狸', 'hú li', '狐狸的尾巴蓬蓬的，耳朵尖尖的。', '森林草原'],
    ['松鼠', 'sōng shǔ', '松鼠有一条大尾巴，喜欢在树上活动。', '森林草原'],
    ['考拉', 'kǎo lā', '考拉抱着树枝，吃桉树的叶子。', '森林草原'],
    ['河马', 'hé mǎ', '河马的嘴巴大大的，喜欢待在水里。', '水边伙伴'],
    ['企鹅', 'qǐ é', '企鹅摇摇摆摆走路，在水里游得很快。', '水边伙伴'],
    ['鸭子', 'yā zi', '鸭子嘎嘎叫，小脚像一把把小扇子。', '农场伙伴'],
    ['猫头鹰', 'māo tóu yīng', '猫头鹰的眼睛大大的，很多猫头鹰夜里活动。', '森林草原'],
    ['海豚', 'hǎi tún', '海豚在海里游泳，会到水面上呼吸。', '水边伙伴'],
    ['乌龟', 'wū guī', '乌龟背着硬硬的壳，慢慢地向前爬。', '水边伙伴'],
  ],
  fruits: [
    ['苹果', 'píng guǒ', '苹果圆圆的，咬一口脆脆的。'], ['香蕉', 'xiāng jiāo', '香蕉弯弯的，像一轮小月亮。'],
    ['橙子', 'chéng zi', '橙子穿着橙色的外衣，果汁甜甜酸酸。'], ['葡萄', 'pú tao', '一颗颗葡萄聚在一起，变成一串。'],
    ['草莓', 'cǎo méi', '草莓红红的，身上有好多小点点。'], ['西瓜', 'xī guā', '西瓜外面绿绿的，里面的果肉水分多。'],
    ['梨', 'lí', '梨的肚子圆圆的，吃起来脆脆甜甜。'], ['桃子', 'táo zi', '桃子粉粉的，有的外皮有细细的绒毛。'],
    ['菠萝', 'bō luó', '菠萝头上长着一簇尖尖的绿叶。'], ['芒果', 'máng guǒ', '芒果的果肉金黄，闻起来香香的。'],
    ['猕猴桃', 'mí hóu táo', '猕猴桃切开后，能看见一圈小种子。'], ['樱桃', 'yīng táo', '樱桃小小圆圆的，连着细细的果柄。'],
    ['蓝莓', 'lán méi', '蓝莓是一颗颗蓝紫色的小果子。'], ['柠檬', 'níng méng', '柠檬黄黄的，尝起来酸酸的。'],
    ['火龙果', 'huǒ lóng guǒ', '火龙果的果肉里，藏着好多黑色小种子。'], ['椰子', 'yē zi', '椰子的外壳硬硬的，里面有椰子水。'],
    ['柿子', 'shì zi', '成熟的柿子橙红橙红，像一盏小灯笼。'], ['石榴', 'shí liu', '石榴里面藏着一颗颗亮亮的小果粒。'],
    ['荔枝', 'lì zhī', '荔枝剥开外皮，果肉白白的。'], ['哈密瓜', 'hā mì guā', '哈密瓜的果肉甜甜的，外皮常有网纹。'],
  ],
  weather: [
    ['晴天', 'qíng tiān', '太阳出来啦，暖暖的阳光洒下来。'], ['白云', 'bái yún', '白云飘在天空，像软软的棉花。'],
    ['下雨', 'xià yǔ', '滴答滴答，小雨点从天空落下来。'], ['下雪', 'xià xuě', '小雪花飘下来，给大地盖上白被子。'],
    ['彩虹', 'cǎi hóng', '雨后有时能看见彩虹，弯弯的，颜色真多。'], ['刮风', 'guā fēng', '风吹过来，树叶轻轻摇。'],
    ['闪电', 'shǎn diàn', '天空闪了一下！雷雨时和大人待在安全的室内。'], ['雾', 'wù', '雾像薄薄的白纱，远处的东西看不清。'],
    ['阴天', 'yīn tiān', '云把太阳遮住了，天空灰灰的。'], ['星星', 'xīng xing', '夜晚的天空，有好多亮亮的星星。'],
    ['月亮', 'yuè liang', '月亮有时圆圆的，有时弯弯的。'], ['日出', 'rì chū', '早晨，太阳慢慢从天边升起来。'],
    ['晚霞', 'wǎn xiá', '傍晚的云，有时会变成粉红色和橙色。'], ['露珠', 'lù zhū', '早晨的叶子上，挂着小小的露珠。'],
    ['霜', 'shuāng', '很冷的早晨，草叶上可能有白白的霜。'], ['冰', 'bīng', '水遇到足够冷的天气，就会结成冰。'],
    ['雨伞', 'yǔ sǎn', '下雨时撑起小伞，挡住落下的雨点。'], ['雨靴', 'yǔ xuē', '下雨天穿雨靴，让小脚保持干爽。'],
    ['遮阳帽', 'zhē yáng mào', '阳光强的时候，出门记得戴上遮阳帽。'], ['雪人', 'xuě rén', '和大人一起，把白白的雪堆成雪人。'],
  ],
  objects: [
    ['杯子', 'bēi zi', '小杯子，装好水，口渴了喝一口。'], ['勺子', 'sháo zi', '小勺子，可以舀起饭菜。'],
    ['碗', 'wǎn', '小碗里装着香香的饭。'], ['盘子', 'pán zi', '盘子平平的，可以放好吃的食物。'],
    ['牙刷', 'yá shuā', '小牙刷，每天帮我们清洁牙齿。'], ['毛巾', 'máo jīn', '软软的毛巾，擦擦小手和小脸。'],
    ['鞋子', 'xié zi', '穿上合脚的鞋子，保护我们的小脚。'], ['袜子', 'wà zi', '小袜子，套在脚上暖暖的。'],
    ['帽子', 'mào zi', '小帽子，戴在头顶上。'], ['上衣', 'shàng yī', '伸伸手，穿上干净的小上衣。'],
    ['裤子', 'kù zi', '小裤子，有两个裤腿。'], ['书包', 'shū bāo', '小书包，可以装下书和小物品。'],
    ['皮球', 'pí qiú', '圆圆的皮球，拍一拍，跳起来。'], ['玩具车', 'wán jù chē', '小小玩具车，推一推，向前走。'],
    ['积木', 'jī mù', '把大块积木叠起来，搭一座小房子。'], ['图画书', 'tú huà shū', '翻开图画书，一起看看里面的故事。'],
    ['椅子', 'yǐ zi', '小椅子，坐下来休息一下。'], ['桌子', 'zhuō zi', '桌子上，可以放书和画纸。'],
    ['小床', 'xiǎo chuáng', '躺在小床上，安安静静睡个好觉。'], ['时钟', 'shí zhōng', '时钟告诉我们，现在是什么时间。'],
  ],
  hanzi: [
    ['日', 'rì', '日，就是太阳。太阳出来了！'], ['月', 'yuè', '月，就是月亮。月亮挂在天上。'],
    ['山', 'shān', '山，有高高的山峰。'], ['水', 'shuǐ', '水，可以流进小河里。'],
    ['木', 'mù', '木，让我们想到一棵树。'], ['人', 'rén', '你和我，都是人。'],
    ['口', 'kǒu', '张开口，说一句你好。'], ['手', 'shǒu', '伸出小手，挥一挥。'],
    ['足', 'zú', '足，就是脚。小脚慢慢走。'], ['目', 'mù', '目，就是眼睛。用眼睛看世界。'],
    ['耳', 'ěr', '耳朵听一听，小鸟在唱歌。'], ['田', 'tián', '田里可以种庄稼。'],
    ['火', 'huǒ', '火很烫，只能远远地看，不可以碰。'], ['石', 'shí', '石头硬硬的，有大也有小。'],
    ['花', 'huā', '花儿开了，颜色真漂亮。'], ['鸟', 'niǎo', '小鸟长着羽毛和翅膀。'],
    ['鱼', 'yú', '小鱼摆摆尾巴，在水里游。'], ['马', 'mǎ', '小马有四条腿，跑得快。'],
    ['牛', 'niú', '小牛哞哞叫，低头吃青草。'], ['羊', 'yáng', '小羊咩咩叫，身上长着毛。'],
  ],
  phrases: [
    ['喝水', 'hē shuǐ', '我想喝水。'], ['吃饭', 'chī fàn', '我要吃饭啦。'],
    ['洗手', 'xǐ shǒu', '吃饭前，洗洗手。'], ['刷牙', 'shuā yá', '我们一起刷牙。'],
    ['洗脸', 'xǐ liǎn', '洗洗小脸，真干净。'], ['穿鞋', 'chuān xié', '我要穿鞋子。'],
    ['戴帽子', 'dài mào zi', '出门啦，戴好帽子。'], ['睡觉', 'shuì jiào', '晚安，我要睡觉了。'],
    ['起床', 'qǐ chuáng', '早上好，我起床啦。'], ['看书', 'kàn shū', '我们一起看书吧。'],
    ['拍皮球', 'pāi pí qiú', '小皮球，拍一拍。'], ['抱一抱', 'bào yi bào', '妈妈，我想抱一抱。'],
    ['你好', 'nǐ hǎo', '你好，很高兴见到你。'], ['再见', 'zài jiàn', '挥挥手，我们下次见。'],
    ['谢谢', 'xiè xie', '谢谢你帮我。'], ['对不起', 'duì bu qǐ', '对不起，我不是故意的。'],
    ['慢慢走', 'màn màn zǒu', '小脚慢慢走，不着急。'], ['收玩具', 'shōu wán jù', '玩好啦，把玩具送回家。'],
    ['看花花', 'kàn huā hua', '看，花花真漂亮。'], ['听音乐', 'tīng yīn yuè', '听一听，音乐真好听。'],
  ],
};

export function chineseNumber(value: number): string {
  const digits = '零一二三四五六七八九';
  if (value === 100) return '一百';
  if (value < 10) return digits[value];
  const tens = Math.floor(value / 10);
  return `${tens === 1 ? '' : digits[tens]}十${value % 10 ? digits[value % 10] : ''}`;
}

export function numberPinyin(value: number): string {
  const syllables: Record<string, string> = { 零: 'líng', 一: 'yī', 二: 'èr', 三: 'sān', 四: 'sì', 五: 'wǔ', 六: 'liù', 七: 'qī', 八: 'bā', 九: 'jiǔ', 十: 'shí', 百: 'bǎi' };
  return Array.from(chineseNumber(value), character => syllables[character]).join(' ');
}

export const pictures: Picture[] = [
  ...Object.entries(rows).flatMap(([category, items]) => items.map(([name, pronunciation, description, group], index) => ({
    id: `${category}-${String(index + 1).padStart(2, '0')}`, category: category as CategoryId,
    name, english: englishLabel(category, index), pronunciation, description, group,
    image: `/art/hd/${category}-${String(index + 1).padStart(2, '0')}-thumb.webp`,
    imageLarge: `/art/hd/${category}-${String(index + 1).padStart(2, '0')}-full.webp`,
  }))),
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `numbers-${i + 1}`, category: 'numbers' as const, name: String(i + 1), english: englishNumber(i + 1), value: i + 1,
    pronunciation: chineseNumber(i + 1), description: `这是${chineseNumber(i + 1)}。和爸爸妈妈一起，数一数下面的小圆点。`,
  })),
  ...Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (name) => ({
    id: `letters-${name}`, category: 'letters' as const, name, english: name, pronunciation: name.toLowerCase(),
    description: `这是大写字母 ${name}，旁边是它的小写 ${name.toLowerCase()}。找一找，它们长得一样吗？`,
  })),
];

export const animalGroups = ['全部朋友', '森林草原', '农场伙伴', '水边伙伴'];
