import { useEffect, useRef, useState } from 'react';
import { pictures, type CategoryId, type Picture } from './content';
import { createRecordedAudio } from './recordedAudio';
import media from './media.json';

function readSaved(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('zoo-favorites') ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && pictures.some(p => p.id === id)) : [];
  } catch { return []; }
}

export function useIsland() {
  const [category, setCategory] = useState<CategoryId>('animals');
  const [group, setGroup] = useState('全部朋友');
  const [numberPage, setNumberPage] = useState(0);
  const [collection, setCollection] = useState(false);
  const [favorites, setFavorites] = useState(readSaved);
  const [selected, setSelected] = useState<Picture | null>(null);
  const [message, setMessage] = useState('');
  const [visited, setVisited] = useState<string[]>([]);
  const [parentOpen, setParentOpen] = useState(false);
  const player = useRef<ReturnType<typeof createRecordedAudio> | null>(null);
  if (!player.current) player.current = createRecordedAudio(setMessage);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  function stopSpeech() {
    player.current?.stop();
  }

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) stopSpeech(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', stopSpeech);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', stopSpeech);
      stopSpeech();
    };
  }, []);

  const items = pictures.filter(p => collection ? favorites.includes(p.id) :
    p.category === category &&
    (category !== 'animals' || group === '全部朋友' || p.group === group) &&
    (category !== 'numbers' || (p.value! > numberPage * 20 && p.value! <= (numberPage + 1) * 20)));

  function speak(picture: Picture, language: 'zh' | 'en') {
    setMessage('');
    const recordings: Record<string, { zh: string; en: string }> = media.audio;
    player.current!.play(recordings[picture.id][language]);
  }

  function openPicture(picture: Picture) {
    stopSpeech();
    setSelected(picture);
    setVisited(ids => ids.includes(picture.id) ? ids : [...ids, picture.id]);
  }

  function chooseCategory(id: CategoryId) {
    stopSpeech(); setCategory(id); setCollection(false); setGroup('全部朋友'); setNumberPage(0);
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
    setFavorites(next);
    if (collection && selected?.id === id && !next.includes(id)) {
      stopSpeech(); setSelected(null);
    }
    try { localStorage.setItem('zoo-favorites', JSON.stringify(next)); }
    catch { setMessage('已暂存到本次浏览，浏览器未允许保存到设备。'); }
  }

  function move(step: number) {
    const index = items.findIndex(p => p.id === selected?.id);
    if (items.length) openPicture(items[(index + step + items.length) % items.length]);
  }

  return {
    category, group, setGroup, numberPage, setNumberPage, collection, setCollection,
    favorites, selected, message, visited, parentOpen, setParentOpen, items,
    chooseCategory, openPicture, toggleFavorite, speak, stopSpeech, move,
    closePicture: () => { stopSpeech(); setSelected(null); },
    surprise: () => { if (items.length) openPicture(items[Math.floor(Math.random() * items.length)]); },
  };
}
