import assert from 'node:assert/strict';
import { createRecordedAudio } from '../src/recordedAudio.ts';
import { narrationSegments } from '../src/narration.ts';

const created: FakeAudio[] = [];
class FakeAudio {
  paused = false;
  removed = false;
  reloaded = false;
  src: string;
  duration = NaN;
  currentTime = 0;
  ended = false;
  onplaying: (() => void) | null = null;
  ontimeupdate: (() => void) | null = null;
  onended: (() => void) | null = null;
  reject!: (error: Error) => void;
  constructor(src: string) { this.src = src; created.push(this); }
  play() { return new Promise<void>((_resolve, reject) => { this.reject = reject; }); }
  pause() { this.paused = true; }
  removeAttribute() { this.removed = true; }
  load() { this.reloaded = true; }
}
Object.assign(globalThis, { Audio: FakeAudio });
const errors: string[] = [];
const progress: (number | null)[] = [];
const onProgress = (value: number | null) => progress.push(value);
const player = createRecordedAudio(message => errors.push(message));
player.play('/first.mp3', onProgress);
created[0].onplaying!();
assert.equal(progress.at(-1), null);
created[0].duration = 10;
created[0].onplaying!();
assert.equal(progress.at(-1), 0);
created[0].currentTime = 5;
created[0].ontimeupdate!();
assert.equal(progress.at(-1), 0.5);
created[0].ended = true;
created[0].onended!();
assert.equal(progress.at(-1), null);
const staleUpdate = created[0].ontimeupdate!;
player.play('/second.mp3', onProgress);
staleUpdate();
assert.equal(progress.length, 4);
assert.equal(created[0].ontimeupdate, null);
assert.ok(created[0].paused && created[0].removed && created[0].reloaded);
created[0].reject(new Error('stale request'));
await Promise.resolve();
assert.equal(errors.length, 0);
player.stop();
created[1].reject(new DOMException('interrupted', 'AbortError'));
await Promise.resolve();
assert.equal(errors.length, 0);
player.play('/third.mp3', onProgress);
created[2].reject(new DOMException('gesture required', 'NotAllowedError'));
await Promise.resolve();
assert.match(errors[0], /暂未允许播放/);
player.play('/fourth.mp3', onProgress);
created[3].reject(new Error('network'));
await Promise.resolve();
assert.match(errors[1], /加载失败/);
for (const [text, language] of [['Lion. A fluffy mane.', 'en'], ['狮子。蓬松的鬃毛。', 'zh'], ['A', 'en'], ['', 'zh']] as const) {
  const segments = narrationSegments(text, language);
  assert.equal(segments.map(part => part.text).join(''), text);
  const words = segments.filter(part => part.end > part.start);
  if (text) {
    assert.equal(words[0].start, 0);
    assert.equal(words.at(-1)!.end, 1);
    for (const word of words) {
      const midpoint = (word.start + word.end) / 2;
      assert.equal(segments.filter(part => midpoint >= part.start && midpoint < part.end).length, 1);
    }
  }
}
console.log('录音播放器检查通过：独占播放、停止、过期事件隔离、失败提示、中英文分词及进度。');
