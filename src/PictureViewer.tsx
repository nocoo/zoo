import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Button } from 'animal-island-ui';
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, HeartIcon, MusicIcon } from 'naive-icons';
import { Illustration } from './Illustration';
import type { useIsland } from './useIsland';
import { swipeStep } from './swipe';
import './viewer.css';

export function PictureViewer({ island }: { island: ReturnType<typeof useIsland> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const picture = island.selected!;
  const index = island.items.findIndex(item => item.id === picture.id);

  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  function finishGesture(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    setOffset(0);
    const step = swipeStep(event.clientX - start.x, event.clientY - start.y);
    if (step && island.items.length > 1) island.move(step);
  }

  return <dialog ref={dialog} className="picture-viewer" aria-labelledby="viewer-name" aria-describedby="viewer-description"
    onCancel={event => { event.preventDefault(); island.closePicture(); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); island.move(event.key === 'ArrowLeft' ? -1 : 1);
      }
    }}>
    <header className="viewer-toolbar">
      <Button type="text" autoFocus aria-label="关闭认知卡片" onClick={island.closePicture} icon={<CloseIcon size={25} color="currentColor" />} />
      <span>{index + 1} / {island.items.length}</span>
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
      <div key={picture.id} className="viewer-art" style={{ transform: `translateX(${offset}px)` }}><Illustration picture={picture} large /></div>
    </div>
    <footer className="viewer-footer">
      <div className="viewer-caption" aria-live="polite">
        <span className="viewer-pronunciation">{picture.category === 'letters' ? '大写和小写' : picture.pronunciation}</span>
        <div className="viewer-name-row"><h2 id="viewer-name">{picture.category === 'letters' ? `${picture.name} ${picture.pronunciation}` : picture.name}</h2>
          <Button type="text" aria-label="再听一遍" onClick={() => island.speak(picture, true)} icon={<MusicIcon size={27} color="currentColor" />} /></div>
        <p id="viewer-description">{picture.description}</p>
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
