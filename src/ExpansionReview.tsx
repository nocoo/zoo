import { useState } from 'react';
import { Button } from 'animal-island-ui';
import { expansionCategories, type ExpansionCategory } from './expansion';
import './expansion-review.css';

function cardCount(groups: ExpansionCategory[]) {
  return groups.reduce((total, group) => total + group.cards.length, 0);
}

function Group({ category }: { category: ExpansionCategory }) {
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
          </article>
        ))}
      </div>
    </section>
  );
}

export function ExpansionReview() {
  const [filter, setFilter] = useState('all');
  const newGroups = expansionCategories.filter(group => group.kind === 'new');
  const existingGroups = expansionCategories.filter(group => group.kind === 'existing');
  const total = cardCount(expansionCategories);
  const visibleNew = filter === 'all' ? newGroups : newGroups.filter(group => group.id === filter);
  const visibleExisting = filter === 'all' ? existingGroups : existingGroups.filter(group => group.id === filter);

  return (
    <div className="expansion-review">
      <a className="skip-link" href="#review-copy">跳到草稿正文</a>
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
        <h1>第一阶段文案草稿</h1>
        <p className="review-lead">这些草稿正在等待确认。现在没有新图片和新录音，也不能在小岛上点开播放。请按卡片编号反馈。</p>

        <nav className="review-filters" aria-label="按分类查看">
          <Button size="small" type={filter === 'all' ? 'primary' : 'text'} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            全部 {total}
          </Button>
          {newGroups.map(group => (
            <Button key={group.id} size="small" type={filter === group.id ? 'primary' : 'text'} aria-pressed={filter === group.id} onClick={() => setFilter(group.id)}>
              {group.name} {group.cards.length}
            </Button>
          ))}
          {existingGroups.map(group => (
            <Button key={group.id} size="small" type={filter === group.id ? 'primary' : 'text'} aria-pressed={filter === group.id} onClick={() => setFilter(group.id)}>
              {group.name} {group.cards.length}
            </Button>
          ))}
        </nav>

        {visibleNew.length > 0 && (
          <section className="review-bucket" aria-labelledby="review-new">
            <h2 id="review-new">新增分类 <span>{visibleNew.length} 组 · {cardCount(visibleNew)} 张</span></h2>
            {visibleNew.map(group => <Group key={group.id} category={group} />)}
          </section>
        )}

        {visibleExisting.length > 0 && (
          <section className="review-bucket" aria-labelledby="review-existing">
            <h2 id="review-existing">现有分类补充 <span>{visibleExisting.length} 组 · {cardCount(visibleExisting)} 张</span></h2>
            {visibleExisting.map(group => <Group key={group.id} category={group} />)}
          </section>
        )}

        <p className="review-footer"><a className="review-back" href="/">回到小岛</a></p>
      </main>
    </div>
  );
}
