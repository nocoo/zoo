import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import vm from 'node:vm';

const handlers = {};
const stores = new Map();
const caches = {
  async keys() { return [...stores.keys()]; },
  async delete(key) { return stores.delete(key); },
  async open(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      async addAll(urls) { for (const url of urls) store.set(url, new Response(url)); },
      async keys() { return [...store.keys()]; },
      async match(key) { return store.get(typeof key === 'string' ? key : key.url)?.clone(); },
      async put(key, response) { store.set(typeof key === 'string' ? key : key.url, response); },
      async delete(key) { return store.delete(key); },
    };
  },
};
let online = true;
const worker = await readFile('dist/sw.js', 'utf8');
const shell = JSON.parse(worker.match(/const SHELL = (.*);/)[1]);
assert.ok(shell.includes('/'));
assert.ok(!shell.some(url => /^\/(api|art|audio|voice-preview)\//.test(url)));
for (const url of shell) assert.ok((await stat(`dist${url === '/' ? '/index.html' : url}`)).isFile());
vm.runInNewContext(worker, {
  caches, URL, Response,
  fetch: async () => { if (!online) throw new Error('offline'); return new Response('image', { headers: { 'Content-Type': 'image/webp' } }); },
  self: { location: { origin: 'https://zoo.test' }, clients: { claim: async () => {} }, addEventListener: (name, handler) => { handlers[name] = handler; } },
});
let lifetime;
handlers.install({ waitUntil: promise => { lifetime = promise; } });
await lifetime;
async function request(path, mode = 'cors', headers = new Headers()) {
  let response;
  let done;
  handlers.fetch({ request: { url: `https://zoo.test${path}`, method: 'GET', mode, headers }, respondWith: value => { response = value; }, waitUntil: value => { done = value; } });
  const result = await response;
  await done;
  return result;
}
for (let n = 0; n < 55; n++) await request(`/art/${n}.webp`);
const art = await caches.open((await caches.keys()).find(key => key.startsWith('zoo-art-')));
assert.equal((await art.keys()).length, 48);
online = false;
assert.ok((await request('/')).ok);
assert.equal(await (await request('/art/54.webp')).text(), 'image');
assert.match(await (await request('/art/unseen.webp')).text(), /联网/);
assert.equal(await request('/audio/test.mp3'), undefined);
assert.equal(await request('/api/live'), undefined);
assert.equal(await request('/api/live', 'navigate'), undefined);
assert.equal(await request('/art/54.webp', 'cors', new Headers({ Range: 'bytes=0-10' })), undefined);
assert.ok((await request('/assets/' + shell.find(url => url.endsWith('.js')).split('/').pop())).ok);
console.log('PWA 检查通过：应用文件齐全、图片缓存上限、离线入口、未缓存提示和音频 Range 排除。');
