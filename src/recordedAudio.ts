export function createRecordedAudio(onError: (message: string) => void) {
  let active: HTMLAudioElement | null = null;

  function stop() {
    const previous = active;
    active = null;
    if (previous) {
      previous.ontimeupdate = previous.onplaying = previous.onended = null;
      previous.pause();
      previous.removeAttribute('src');
      previous.load();
    }
  }

  function play(url: string, onProgress: (progress: number | null) => void) {
    stop();
    const audio = new Audio(url);
    active = audio;
    const update = () => {
      if (active !== audio) return;
      onProgress(!audio.ended && Number.isFinite(audio.duration) && audio.duration > 0
        ? Math.min(1, Math.max(0, audio.currentTime / audio.duration)) : null);
    };
    audio.ontimeupdate = audio.onplaying = audio.onended = update;
    audio.play().catch(error => {
      if (active !== audio) return;
      stop();
      onError(error instanceof DOMException && error.name === 'NotAllowedError'
        ? '浏览器暂未允许播放，请再点一下读音按钮。'
        : '录音暂时加载失败，请检查网络后再点读音按钮。');
    });
  }

  return { play, stop };
}
