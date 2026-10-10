import { Button, Modal } from 'animal-island-ui';
import {
  AppleIcon, BearIcon, BookIcon, ChatIcon,
  CheckIcon, ChevronRightIcon, FlowerIcon, HeartIcon, HomeIcon, LeafIcon,
  MusicIcon, PlayIcon, SettingsIcon, StarIcon, SunIcon,
} from 'naive-icons';
import { animalGroups, categories } from './content';
import { useIsland } from './useIsland';
import { Illustration } from './Illustration';
import { PictureViewer } from './PictureViewer';

const categoryIcons = {
  animals: BearIcon, numbers: StarIcon, letters: BookIcon, hanzi: BookIcon,
  phrases: ChatIcon, weather: SunIcon, objects: HomeIcon, fruits: AppleIcon,
};

export function App() {
  const island = useIsland();
  const active = categories.find(c => c.id === island.category)!;
  function goExplore() {
    island.setCollection(false);
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <a className="skip-link" href="#explore">跳到认知卡片</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#" onClick={() => { island.chooseCategory('animals'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="小小动物岛首页">
            <img className="brand-mark" src="/icons/logo-80.png" width="51" height="51" alt="" />
            <span><strong>小小动物岛</strong><small>和好奇心一起长大</small></span>
          </a>
          <nav className="main-nav" aria-label="主导航">
            <Button type={!island.collection ? 'primary' : 'text'} icon={<LeafIcon size={19} color="currentColor" />} onClick={goExplore}>探索小岛</Button>
            <Button type={island.collection ? 'primary' : 'text'} icon={<HeartIcon size={19} color="currentColor" />} onClick={() => { island.setCollection(true); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }); }}>我的收藏{island.favorites.length > 0 && <span className="favorite-total">{island.favorites.length}</span>}</Button>
          </nav>
          <div className="header-actions">
            <Button type="default" data-tooltip="家长小贴士" onClick={() => island.setParentOpen(true)} icon={<SettingsIcon size={18} color="currentColor" />} aria-label="家长小贴士"><span className="parent-label">家长入口</span></Button>
            <a className="hexly-entry" href="https://hexly.ai/projects/zoo" target="_blank" rel="noopener noreferrer" aria-label="在 hexly.ai 查看小小动物岛（新标签页）" data-tooltip="在 hexly.ai 查看小小动物岛">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m12 2 8.66 5v10L12 22l-8.66-5V7Z" /><path d="M12 2v20M3.34 7l17.32 10m0-10L3.34 17" /></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <span className="eyebrow"><SunIcon size={18} color="currentColor" /> 1.5–3 岁宝宝的认知小天地</span>
            <h1 id="hero-title">小小眼睛，<br />发现<span>大大世界</span><FlowerIcon className="title-flower" size={37} color="currentColor" /></h1>
            <p>每一次好奇，都是成长的开始。<br />和动物朋友一起，把世界认一点点。</p>
            <div className="hero-actions">
              <Button type="primary" size="large" onClick={goExplore} icon={<PlayIcon size={20} color="currentColor" />}>一起去探索</Button>
              <span><HeartIcon size={16} color="currentColor" /> 陪伴，是最好的启蒙</span>
            </div>
          </div>
          <div className="hero-picture"><img src="/art/hero.webp" alt="狮子、熊猫、兔子、大象和长颈鹿一起在彩色小岛上玩耍" fetchPriority="high" width="1536" height="1024" /><div className="hero-sticker"><LeafIcon size={17} color="currentColor" /> 今天也有新发现！</div></div>
        </section>

        <section className="category-section" aria-labelledby="category-heading">
          <div className="section-kicker"><span id="category-heading">选一个喜欢的小世界</span><span>小手点一点，快乐学一点</span></div>
          <nav className="category-grid" aria-label="认知分类">
            {categories.map(category => {
              const Icon = categoryIcons[category.id];
              return <div key={category.id} className={`category-tile tone-${category.tone} ${!island.collection && island.category === category.id ? 'is-active' : ''}`}>
                <Button type="text" className="category-button" aria-pressed={!island.collection && island.category === category.id} onClick={() => island.chooseCategory(category.id)}>
                  <span className="category-symbol" aria-hidden="true">{category.id === 'numbers' ? <b>123</b> : category.id === 'letters' ? <b>Aa</b> : category.id === 'hanzi' ? <b>字</b> : <Icon size={33} color="currentColor" />}</span>
                  <strong>{category.name}</strong><small>{category.subtitle}</small>
                </Button>
              </div>;
            })}
          </nav>
        </section>

        <section className="explore-section" id="explore" aria-labelledby="explore-heading">
          <div className="explore-heading-row">
            <div><div className="section-eyebrow"><span className={`tiny-dot tone-${active.tone}`} />{island.collection ? '装进口袋里的喜欢' : active.name}<span className="count-badge">{island.collection ? island.items.length : island.category === 'numbers' ? 30 : island.category === 'letters' ? 26 : 20} 张认知卡</span></div>
              <h2 id="explore-heading">{island.collection ? '喜欢的朋友，都在这里' : active.title}</h2>
              <p>{island.collection ? '一点小小的喜欢，值得再看一次' : active.hint}</p></div>
            <Button type="default" icon={<StarIcon size={18} color="currentColor" />} disabled={!island.items.length} onClick={island.surprise}>随便认一个</Button>
          </div>

          {!island.collection && island.category === 'animals' && <div className="filter-row" aria-label="动物生活环境">
            <div className="filter-buttons">{animalGroups.map(group => <Button key={group} size="small" type={island.group === group ? 'primary' : 'text'} aria-pressed={island.group === group} onClick={() => island.setGroup(group)}>{group}</Button>)}</div>
            <span className="gentle-note"><MusicIcon size={15} color="currentColor" /> 点击卡片，看图认朋友</span>
          </div>}
          {!island.collection && island.category === 'numbers' && <div className="filter-row"><div className="filter-buttons">{Array.from({ length: 3 }, (_, index) => <Button key={index} size="small" type={island.numberPage === index ? 'primary' : 'text'} aria-pressed={island.numberPage === index} onClick={() => island.setNumberPage(index)}>{index * 10 + 1}–{(index + 1) * 10}</Button>)}</div><span className="gentle-note">先从 1–5 开始，不着急</span></div>}

          <div className="picture-grid">
            {island.items.map((picture, index) => <article className={`picture-card tone-${['yellow', 'mint', 'rose', 'blue', 'peach'][index % 5]}`} key={picture.id} style={{ animationDelay: `${Math.min(index, 9) * 30}ms` }}>
              <div className="save-button"><Button type="text" aria-label={`${island.favorites.includes(picture.id) ? '取消收藏' : '收藏'}${picture.name}`} aria-pressed={island.favorites.includes(picture.id)} onClick={() => island.toggleFavorite(picture.id)} icon={<HeartIcon size={20} color="currentColor" fill={island.favorites.includes(picture.id) ? 'currentColor' : 'none'} />} /></div>
              <Button type="text" className="picture-button" onClick={() => island.openPicture(picture)} aria-label={`认识${picture.name}`}>
                <div className="picture-art"><Illustration picture={picture} /></div>
                <div className="picture-caption"><div><span className="pronunciation" lang={picture.category === 'letters' ? 'en' : undefined}>{picture.category === 'letters' ? '大写 / 小写' : picture.pronunciation}</span><h3>{picture.category === 'letters' ? `${picture.name} ${picture.pronunciation}` : picture.name}</h3></div><span className="listen-bubble"><MusicIcon size={19} color="currentColor" /></span></div>
              </Button>
              {island.visited.includes(picture.id) && <span className="visited-mark" aria-label="本次已看过"><CheckIcon size={13} color="currentColor" /></span>}
            </article>)}
          </div>

          {island.collection && !island.items.length && <div className="empty-state"><HeartIcon size={54} color="currentColor" /><h3>把喜欢的朋友，装进口袋</h3><p>点击卡片上的小爱心，就可以在这里找到它啦。</p><Button type="primary" onClick={() => island.setCollection(false)}>去认识新朋友</Button></div>}

          <div className="section-footer"><FlowerIcon size={20} color="currentColor" /><span>不比赛，不着急。今天认识一个，也是小小的进步。</span><FlowerIcon size={20} color="currentColor" /></div>
        </section>

        <aside className="parent-note"><span className="parent-note-icon"><HeartIcon size={25} color="currentColor" /></span><div><strong>最好的探索，是和你一起</strong><p>建议每次玩 5–10 分钟，和宝宝一起指一指、说一说，再去真实的世界找一找。</p></div><Button type="text" onClick={() => island.setParentOpen(true)} icon={<ChevronRightIcon size={20} color="currentColor" />} aria-label="查看亲子陪伴小贴士" /></aside>
      </main>

      <footer className="site-footer"><span><LeafIcon size={17} color="currentColor" /> 小小动物岛</span><span>给小小的你，一个充满好奇的世界</span><span>无广告 · 无需登录 · 亲子陪伴</span></footer>

      {island.selected && <PictureViewer island={island} />}

      <Modal open={island.parentOpen} variant="game" width="min(560px, 96vw)" title="给大朋友的小纸条" onClose={() => island.setParentOpen(false)} typewriter={false} footer={<Button type="primary" onClick={() => island.setParentOpen(false)}>知道啦，一起玩吧</Button>}>
        <div className="parent-content"><p>这里不是小课堂，而是你和宝宝一起发现世界的小角落。</p><h3>慢一点，也很好</h3><p>1.5–2 岁以真实生活、亲子共读和实物为主；如果使用屏幕，请全程陪伴。2–3 岁也建议短时共同观看，每次 5–10 分钟，累了就休息。</p><h3>看一看，再找一找</h3><p>先从宝宝熟悉的动物、物品和 1–5 开始。数字 1–30、字母和汉字只是供探索，不是这个年龄必须掌握的目标。不测验、不排名。</p><p>打开和切换卡片保持安静，点击中文或英文按钮才播放对应录音。</p><h3>放到手机主屏幕</h3><p>在 iPhone 的 Safari 中点“分享”，选择“添加到主屏幕”，以后就能像打开 App 一样进入小岛。</p><p>联网打开过后，可以离线进入小岛并查看部分最近浏览的图片；没有保存的图片需要联网。系统可能自动清理缓存。更新后请关闭小岛的所有窗口再打开。</p><p className="privacy-note">无账号、无广告、无行为统计。收藏仅保存在这台设备。朗读播放预先生成的中英文录音，不使用浏览器实时合成。录音需联网加载。</p></div>
      </Modal>
      {island.message && !island.selected && <div className="toast" role="status">{island.message}</div>}
    </>
  );
}
