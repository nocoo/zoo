import { useEffect, useRef, useState } from 'react';
import { pictures, type CategoryId, type Picture } from './content';
import { createRecordedAudio } from './recordedAudio';
import media from './media.json';
import { shuffle } from './shuffle';

function readSaved(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('zoo-favorites') ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string' && pictures.some(p => p.id === id)) : [];
  } catch { return []; }
}

export function useIsland() {
  const [category, setCategory] = useState<CategoryId>('animals');
  const [group, setGroup] = useState('全部朋友');
  const [collection, setCollection] = useState(false);
  const [favorites, setFavorites] = useState(readSaved);
  const [selected, setSelected] = useState<Picture | null>(null);
  const [browseOrder, setBrowseOrder] = useState<Picture[] | null>(null);
  const [message, setMessage] = useState('');
  const [visited, setVisited] = useState<string[]>([]);
  const [parentOpen, setParentOpen] = useState(false);
  const [narration, setNarration] = useState<{
    language: 'zh' | 'en';
    text: string;
  } | null>(null);
  const player = useRef<ReturnType<typeof createRecordedAudio> | null>(null);
  if (!player.current) player.current = createRecordedAudio(error => { setMessage(error); setNarration(null); });

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  function stopSpeech() {
    player.current?.stop();
    setNarration(null);
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
    (category !== 'animals' || group === '全部朋友' || p.group === group));
  const viewerItems = (browseOrder ?? items).filter(picture => items.includes(picture));

  function speak(picture: Picture, language: 'zh' | 'en') {
    setMessage('');
    const recordings: Record<string, { zh: string; en: string }> = media.audio;
    const transcripts: Record<string, { zh: string; en: string }> = media.transcripts;
    setNarration({ language, text: transcripts[picture.id][language] });
    player.current!.play(recordings[picture.id][language]);
  }

  function showPicture(picture: Picture) {
    stopSpeech();
    setSelected(picture);
    setVisited(ids => ids.includes(picture.id) ? ids : [...ids, picture.id]);
  }

  function openPicture(picture: Picture) {
    setBrowseOrder(null);
    showPicture(picture);
  }

  function closePicture() {
    stopSpeech(); setSelected(null); setBrowseOrder(null);
  }

  function surprise() {
    if (!items.length) return;
    const shuffled = shuffle(items);
    setBrowseOrder(shuffled);
    showPicture(shuffled[0]);
  }

  function chooseCategory(id: CategoryId) {
    closePicture(); setCategory(id); setCollection(false); setGroup('全部朋友');
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
    setFavorites(next);
    if (collection && selected?.id === id && !next.includes(id)) {
      closePicture();
    }
    try { localStorage.setItem('zoo-favorites', JSON.stringify(next)); }
    catch { setMessage('已暂存到本次浏览，浏览器未允许保存到设备。'); }
  }

  function move(step: number) {
    const index = viewerItems.findIndex(p => p.id === selected?.id);
    if (viewerItems.length) showPicture(viewerItems[(index + step + viewerItems.length) % viewerItems.length]);
  }

  return {
    category, group, setGroup, collection, setCollection,
    favorites, selected, message, visited, parentOpen, setParentOpen, items, viewerItems, narration,
    chooseCategory, openPicture, closePicture, toggleFavorite, speak, stopSpeech, move, surprise,
  };
}
