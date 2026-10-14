import { useState } from 'react';
import { Button } from 'animal-island-ui';
import { expansionCategories, type ExpansionCard, type ExpansionCategory } from './expansion';
import { useExpansionAudio, type ExpansionLanguage } from './useExpansionAudio';
import './expansion-review.css';

function cardCount(groups: ExpansionCategory[]) {
  return groups.reduce((total, group) => total + group.cards.length, 0);
}

function ListenButton({
  card,
  language,
  url,
  onPlay,
}: {
  card: ExpansionCard;
  language: ExpansionLanguage;
  url: string | undefined;
  onPlay: (id: string, language: ExpansionLanguage) => void;
}) {
  const ready = Boolean(url);
  const label = language === 'zh'
    ? (ready ? '听中文' : '中文待录音')
    : (ready ? '听英文' : '英文待录音');
  const action = language === 'zh' ? `播放中文：${card.name}` : `播放英文：${card.english}`;
  const pending = language === 'zh' ? `${card.name}中文待录音` : `${card.english}英文待录音`;

  return (
    <Button
      size="small"
      type="default"
      disabled={!ready}
      aria-label={ready ? action : pending}
      onClick={() => { if (url) onPlay(card.id, language); }}
    >
      {label}
    </Button>
  );
}

function Group({
  category,
  urlFor,
  onPlay,
}: {
  category: ExpansionCategory;
  urlFor: (id: string, language: ExpansionLanguage) => string | undefined;
  onPlay: (id: string, language: ExpansionLanguage) => void;
}) {
  return (
    <section className="review-group" aria-labelledby={`group-${category.id}`}>
      <h3 id={`group-${category.id}`}>
        <code>{category.id}</code>
        {category.name}
        <span>{category.cards.length} 张</span>
      </h3>
      <div className="review-cards">
        {category.cards.map(card => (
          <article key={card.id} className="review-card" aria-labelledby={`${card.id}-name`}>
            <div className="review-card-top">
              <code className="review-id">{card.id}</code>
              <span className={`review-kind tone-${category.kind === 'new' ? 'mint' : 'peach'}`}>{category.kind === 'new' ? '新增' : '补充'}</span>
            </div>
            <h4 id={`${card.id}-name`}>{card.name}</h4>
            <p className="review-pinyin">{card.pronunciation}</p>
            <p className="review-english" lang="en">{card.english}</p>
            <dl className="review-copy">
              <dt>中文</dt>
              <dd>{card.description}</dd>
              <dt>英文</dt>
              <dd lang="en">{card.englishDescription}</dd>
            </dl>
            <div className="review-listen">
              <ListenButton card={card} language="zh" url={urlFor(card.id, 'zh')} onPlay={onPlay} />
              <ListenButton card={card} language="en" url={urlFor(card.id, 'en')} onPlay={onPlay} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ExpansionReview() {
  const [filter, setFilter] = useState('all');
  const audio = useExpansionAudio(filter);
  const newGroups = expansionCategories.filter(group => group.kind === 'new');
  const existingGroups = expansionCategories.filter(group => group.kind === 'existing');
  const total = cardCount(expansionCategories);
  const visibleNew = filter === 'all' ? newGroups : newGroups.filter(group => group.id === filter);
  const visibleExisting = filter === 'all' ? existingGroups : existingGroups.filter(group => group.id === filter);
  const cards = expansionCategories.flatMap(group => group.cards);
  const zhReady = cards.filter(card => audio.urlFor(card.id, 'zh')).length;
  const enReady = cards.filter(card => audio.urlFor(card.id, 'en')).length;

  function chooseFilter(next: string) {
    if (next !== filter) audio.stop();
    setFilter(next);
  }

  return (
    <div className="expansion-review">
      <a className="skip-link" href="#review-copy">跳到试听正文</a>
      <header className="review-header">
        <div className="review-header-inner">
          <div className="review-brand">
            <img className="brand-mark" src="/icons/logo-80.png" width="51" height="51" alt="" />
            <span>
              <strong>小小动物岛</strong>
              <small>家长审稿</small>
            </span>
          </div>
          <a className="review-back" href="/">回到小岛</a>
        </div>
      </header>

      <main className="review-main" id="review-copy">
        <h1>第三阶段：试听临时录音</h1>
        <p className="review-lead">77 张扩展开卡片的中英文文案已经确认。可以用下面的按钮试听临时 Edge 录音。小岛上正在用的 176 张卡片、图片和录音都没有改动。现在还没有新插画，这些卡片也不能在小岛上点开。</p>
        <p className="review-status" role="status">临时 Edge 录音进度：中文 {zhReady}/{total}，英文 {enReady}/{total}。没有录音地址的按钮会标明「待录音」，不能播放。</p>

        <div className="review-toolbar">
          <nav className="review-filters" aria-label="按分类查看">
            <Button size="small" type={filter === 'all' ? 'primary' : 'text'} aria-pressed={filter === 'all'} onClick={() => chooseFilter('all')}>
              全部 {total}
            </Button>
            {newGroups.map(group => (
              <Button key={group.id} size="small" type={filter === group.id ? 'primary' : 'text'} aria-pressed={filter === group.id} onClick={() => chooseFilter(group.id)}>
                {group.name} {group.cards.length}
              </Button>
            ))}
            {existingGroups.map(group => (
              <Button key={group.id} size="small" type={filter === group.id ? 'primary' : 'text'} aria-pressed={filter === group.id} onClick={() => chooseFilter(group.id)}>
                {group.name} {group.cards.length}
              </Button>
            ))}
          </nav>
          <Button size="small" type="default" onClick={audio.stop}>停止播放</Button>
        </div>

        {visibleNew.length > 0 && (
          <section className="review-bucket" aria-labelledby="review-new">
            <h2 id="review-new">新增分类 <span>{visibleNew.length} 组 · {cardCount(visibleNew)} 张</span></h2>
            {visibleNew.map(group => <Group key={group.id} category={group} urlFor={audio.urlFor} onPlay={audio.play} />)}
          </section>
        )}

        {visibleExisting.length > 0 && (
          <section className="review-bucket" aria-labelledby="review-existing">
            <h2 id="review-existing">现有分类补充 <span>{visibleExisting.length} 组 · {cardCount(visibleExisting)} 张</span></h2>
            {visibleExisting.map(group => <Group key={group.id} category={group} urlFor={audio.urlFor} onPlay={audio.play} />)}
          </section>
        )}

        <p className="review-footer"><a className="review-back" href="/">回到小岛</a></p>
      </main>

      {audio.message && <div className="toast" role="status">{audio.message}</div>}
    </div>
  );
}
