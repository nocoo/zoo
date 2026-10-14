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

  function fail(audio: HTMLAudioElement, error: unknown) {
    if (active !== audio) return;
    stop();
    onError(error instanceof DOMException && error.name === 'NotAllowedError'
      ? '浏览器暂未允许播放，请再点一下读音按钮。'
      : '录音暂时加载失败，请检查网络后再点读音按钮。');
  }

  function play(url: string) {
    stop();
    const audio = new Audio(url);
    active = audio;
    audio.addEventListener('error', () => fail(audio, audio.error));
    audio.play().catch(error => fail(audio, error));
  }

  return { play, stop };
}
