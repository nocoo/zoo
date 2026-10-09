import { useEffect, useRef, useState } from 'react';
import { pictures, type CategoryId, type Picture } from './content';

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
  const [sound, setSound] = useState(true);
  const [message, setMessage] = useState('');
  const [visited, setVisited] = useState<string[]>([]);
  const [parentOpen, setParentOpen] = useState(false);
  const speechRequest = useRef(0);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  function stopSpeech() {
    speechRequest.current += 1;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  const items = pictures.filter(p => collection ? favorites.includes(p.id) :
    p.category === category &&
    (category !== 'animals' || group === '全部朋友' || p.group === group) &&
    (category !== 'numbers' || (p.value! > numberPage * 20 && p.value! <= (numberPage + 1) * 20)));

  function speak(picture: Picture, full = false) {
    if (!('speechSynthesis' in window)) {
      setMessage('这个浏览器暂不支持朗读，可以和宝宝一起读一读哦。');
      return;
    }
    stopSpeech();
    const request = speechRequest.current;
    const text = picture.category === 'letters' ? picture.name :
      picture.category === 'numbers' ? picture.pronunciation :
      full ? `${picture.name}。${picture.description}` : picture.name;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = picture.category === 'letters' ? 'en-US' : 'zh-CN';
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.replace('_', '-').startsWith(utterance.lang));
    if (voice) utterance.voice = voice;
    utterance.rate = 0.8;
    utterance.onerror = event => {
      if (request === speechRequest.current && !['interrupted', 'canceled'].includes(event.error)) {
        setMessage('朗读暂时不可用，请检查设备的语音设置，或陪宝宝读一读。');
      }
    };
    window.speechSynthesis.speak(utterance);
  }

  function openPicture(picture: Picture) {
    setSelected(picture);
    setVisited(ids => ids.includes(picture.id) ? ids : [...ids, picture.id]);
    if (sound) speak(picture);
  }

  function chooseCategory(id: CategoryId) {
    stopSpeech(); setCategory(id); setCollection(false); setGroup('全部朋友'); setNumberPage(0);
  }

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id];
    setFavorites(next);
    try { localStorage.setItem('zoo-favorites', JSON.stringify(next)); }
    catch { setMessage('已暂存到本次浏览，浏览器未允许保存到设备。'); }
  }

  function move(step: number) {
    const index = items.findIndex(p => p.id === selected?.id);
    if (items.length) openPicture(items[(index + step + items.length) % items.length]);
  }

  return {
    category, group, setGroup, numberPage, setNumberPage, collection, setCollection,
    favorites, selected, sound, message, visited, parentOpen, setParentOpen, items,
    chooseCategory, openPicture, toggleFavorite, speak, move,
    closePicture: () => { stopSpeech(); setSelected(null); },
    toggleSound: () => { stopSpeech(); setSound(!sound); },
    surprise: () => { if (items.length) openPicture(items[Math.floor(Math.random() * items.length)]); },
  };
}
