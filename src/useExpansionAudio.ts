import { useEffect, useRef, useState } from 'react';
import { createRecordedAudio } from './recordedAudio';
import expansionMedia from './expansion-media.json';

export type ExpansionLanguage = 'zh' | 'en';

const audio: Record<string, { zh?: string; en?: string }> = expansionMedia.audio;

export function useExpansionAudio(filter: string) {
  const [message, setMessage] = useState('');
  const player = useRef<ReturnType<typeof createRecordedAudio> | null>(null);
  if (!player.current) player.current = createRecordedAudio(error => { setMessage(error); });

  function stop() {
    player.current?.stop();
  }

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    player.current?.stop();
  }, [filter]);

  useEffect(() => {
    const onVisibility = () => { if (document.hidden) player.current?.stop(); };
    const onHide = () => { player.current?.stop(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onHide);
      player.current?.stop();
    };
  }, []);

  function play(id: string, language: ExpansionLanguage) {
    const url = audio[id]?.[language];
    if (!url) return;
    setMessage('');
    player.current!.play(url);
  }

  function urlFor(id: string, language: ExpansionLanguage) {
    return audio[id]?.[language];
  }

  return { play, stop, urlFor, message };
}
