import assert from 'node:assert/strict';
import { createRecordedAudio } from '../src/recordedAudio.ts';

const created: FakeAudio[] = [];
class FakeAudio {
  paused = false;
  removed = false;
  reloaded = false;
  src: string;
  reject!: (error: Error) => void;
  constructor(src: string) { this.src = src; created.push(this); }
  play() { return new Promise<void>((_resolve, reject) => { this.reject = reject; }); }
  pause() { this.paused = true; }
  removeAttribute() { this.removed = true; }
  load() { this.reloaded = true; }
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
assert.match(errors[0], /自动播放/);
player.play('/fourth.mp3');
created[3].reject(new Error('network'));
await Promise.resolve();
assert.match(errors[1], /加载失败/);
console.log('录音播放器检查通过：独占播放、停止、过期错误隔离、失败提示。');
