export function createRecordedAudio(onError: (message: string) => void) {
  let active: HTMLAudioElement | null = null;

  function stop() {
    const previous = active;
    active = null;
    if (previous) {
      previous.pause();
      previous.removeAttribute('src');
      previous.load();
    }
  }

  function play(url: string) {
    stop();
    const audio = new Audio(url);
    active = audio;
    audio.play().catch(error => {
      if (active !== audio) return;
      stop();
      onError(error instanceof DOMException && error.name === 'NotAllowedError'
        ? '浏览器暂未允许自动播放，点一下“再听一遍”就好。'
        : '录音暂时加载失败，请检查网络后点“再听一遍”。');
    });
  }

  return { play, stop };
}
