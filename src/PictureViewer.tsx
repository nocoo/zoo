import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Button } from 'animal-island-ui';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, HeartIcon, MusicIcon, FlowerIcon, LeafIcon, StarIcon } from 'naive-icons';
import { Illustration } from './Illustration';
import type { useIsland } from './useIsland';
import { swipeStep } from './swipe';
import { neighborImages } from './neighbors';
import { numberPinyin } from './content';
import media from './media.json';
import './viewer.css';

export function PictureViewer({ island }: { island: ReturnType<typeof useIsland> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const closing = useRef(false);
  const exitAnimation = useRef<Animation | null>(null);
  const picture = island.selected!;
  const index = island.items.findIndex(item => item.id === picture.id);
  const adjacent = neighborImages(island.items, picture.id).join('|');

  useEffect(() => {
    const images: Record<string, string> = media.images;
    const preload = adjacent.split('|').filter(Boolean).map(path => {
      const image = new Image();
      image.fetchPriority = 'low';
      image.src = images[path];
      return image;
    });
    return () => preload.forEach(image => image.removeAttribute('src'));
  }, [adjacent]);

  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.animate([{ opacity: 0, transform: 'translateY(22px) scale(.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    return () => {
      exitAnimation.current?.cancel();
      element.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  function close() {
    if (closing.current) return;
    closing.current = true;
    island.stopSpeech();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { island.closePicture(); return; }
    const animation = dialog.current!.animate([{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(16px) scale(.98)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    exitAnimation.current = animation;
    animation.finished.then(island.closePicture).catch(() => {});
  }

  function finishGesture(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    setOffset(0);
    const step = swipeStep(event.clientX - start.x, event.clientY - start.y);
    if (step && island.items.length > 1) island.move(step);
  }

  return <dialog ref={dialog} className="picture-viewer" aria-labelledby="viewer-name" aria-describedby="viewer-description"
    onCancel={event => { event.preventDefault(); close(); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); island.move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
    <header className="viewer-toolbar">
      <Button type="text" autoFocus aria-label="关闭认知卡片" onClick={close} icon={<CloseIcon size={25} color="currentColor" />} />
      <span className="viewer-page"><LeafIcon size={16} color="currentColor" /> 小小发现 <b>{index + 1} / {island.items.length}</b></span>
      <Button type="text" aria-label={island.favorites.includes(picture.id) ? '取消收藏' : '收藏'} aria-pressed={island.favorites.includes(picture.id)} onClick={() => island.toggleFavorite(picture.id)} icon={<HeartIcon size={24} color="currentColor" fill={island.favorites.includes(picture.id) ? 'currentColor' : 'none'} />} />
    </header>
    <div className="viewer-stage"
      onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0) return;
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const start = gesture.current;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dy) > 24 && Math.abs(dy) > Math.abs(dx)) { gesture.current = null; setOffset(0); return; }
        setOffset(Math.max(-160, Math.min(160, dx)));
      }}
      onPointerUp={finishGesture}
      onPointerCancel={() => { gesture.current = null; setOffset(0); }}
      onLostPointerCapture={() => { gesture.current = null; setOffset(0); }}>
      <div className="viewer-decor" aria-hidden="true"><FlowerIcon size={38} color="currentColor" /><StarIcon size={25} color="currentColor" /><LeafIcon size={32} color="currentColor" /></div>
      <div key={picture.id} className="viewer-art" style={{ transform: `translateX(${offset}px)` }}><Illustration picture={picture} large /></div>
    </div>
    <footer className="viewer-footer">
      <div className="viewer-caption" aria-live="polite">
        <span className="viewer-pronunciation">{picture.category === 'letters' ? '大写和小写' : picture.category === 'numbers' ? numberPinyin(picture.value!) : picture.pronunciation}</span>
        <div className="viewer-readings">
          <Button type="text" className="reading-button" aria-label={`播放${picture.category === 'letters' ? '字母' : '中文'}：${picture.name}`} onClick={() => island.speak(picture, 'zh')}>
            <span className="reading-label">{picture.category === 'letters' ? '字母' : '中文'} <MusicIcon size={17} color="currentColor" /></span>
            <span id="viewer-name" className="reading-name">{picture.category === 'letters' ? `${picture.name} ${picture.pronunciation}` : picture.category === 'numbers' ? picture.pronunciation : picture.name}</span>
          </Button>
          {picture.category !== 'letters' && <Button type="text" className="reading-button english-reading" aria-label={`播放英文：${picture.english}`} onClick={() => island.speak(picture, 'en')}>
            <span className="reading-label">English <MusicIcon size={17} color="currentColor" /></span>
            <span className="reading-name" lang="en">{picture.english}</span>
          </Button>}
        </div>
        <div id="viewer-description">
          <p lang="zh-CN">{picture.description}</p>
          {picture.englishDescription && <p lang="en">{picture.englishDescription}</p>}
        </div>
        {import.meta.env.DEV && picture.englishDescription && <small className="food-note">英文解释文案预览，现有英文录音仍只读名称。</small>}
        {picture.category === 'fruits' && <small className="food-note">请家长去核、切成适龄小块后再食用。</small>}
      </div>
      <nav className="viewer-navigation" aria-label="切换认知卡片">
        <Button type="text" aria-label="上一个" disabled={island.items.length < 2} onClick={() => island.move(-1)} icon={<ArrowLeftIcon size={23} color="currentColor" />} />
        <span>左右滑动，认识新朋友</span>
        <Button type="text" aria-label="下一个" disabled={island.items.length < 2} onClick={() => island.move(1)} icon={<ArrowRightIcon size={23} color="currentColor" />} />
      </nav>
    </footer>
    {island.message && <div className="toast" role="status">{island.message}</div>}
  </dialog>;
}
