import assert from 'node:assert/strict';
import { createRecordedAudio } from '../src/recordedAudio.ts';

const created: FakeAudio[] = [];
class FakeAudio {
  paused = false;
  removed = false;
  reloaded = false;
  src: string;
  error: unknown = null;
  resolve!: () => void;
  reject!: (error: Error) => void;
  onError?: () => void;
  constructor(src: string) { this.src = src; created.push(this); }
  play() { return new Promise<void>((resolve, reject) => { this.resolve = resolve; this.reject = reject; }); }
  pause() { this.paused = true; }
  removeAttribute() { this.removed = true; }
  load() { this.reloaded = true; }
  addEventListener(type: string, handler: () => void) { if (type === 'error') this.onError = handler; }
  emitError() { this.error = new Error('media'); this.onError?.(); }
}
Object.assign(globalThis, { Audio: FakeAudio });
const errors: string[] = [];
const player = createRecordedAudio(message => errors.push(message));
player.play('/first.mp3');
player.play('/second.mp3');
assert.ok(created[0].paused && created[0].removed && created[0].reloaded);
created[0].reject(new Error('stale request'));
await Promise.resolve();
assert.equal(errors.length, 0);
player.stop();
created[1].reject(new DOMException('interrupted', 'AbortError'));
await Promise.resolve();
assert.equal(errors.length, 0);
player.play('/third.mp3');
created[2].reject(new DOMException('gesture required', 'NotAllowedError'));
await Promise.resolve();
assert.match(errors[0], /暂未允许播放/);
player.play('/fourth.mp3');
created[3].reject(new Error('network'));
await Promise.resolve();
assert.match(errors[1], /加载失败/);
player.play('/fifth.mp3');
created[4].resolve();
await Promise.resolve();
assert.equal(errors.length, 2);
created[4].emitError();
assert.match(errors[2], /加载失败/);
assert.ok(created[4].paused && created[4].removed);
player.play('/sixth.mp3');
player.stop();
created[5].emitError();
await Promise.resolve();
assert.equal(errors.length, 3);
player.play('/seventh.mp3');
created[6].reject(new Error('network'));
created[6].emitError();
await Promise.resolve();
assert.equal(errors.length, 4);
assert.match(errors[3], /加载失败/);
console.log('录音播放器检查通过：独占播放、停止、过期错误隔离、失败提示、播放后媒体错误不重复。');
