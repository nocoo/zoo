const VERSION = '__VERSION__';
const SHELL = __SHELL__;
const APP_CACHE = `zoo-app-${VERSION}`;
const ART_CACHE = `zoo-art-${VERSION}`;
const MAX_IMAGES = 48;
let writes = Promise.resolve();

self.addEventListener('install', event => {
  event.waitUntil(caches.open(APP_CACHE).then(cache => cache.addAll(SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if ((key.startsWith('zoo-app-') || key.startsWith('zoo-art-')) && ![APP_CACHE, ART_CACHE].includes(key)) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

function storeImage(request, response) {
  writes = writes.then(async () => {
    const cache = await caches.open(ART_CACHE);
    await cache.put(request, response);
    const keys = await cache.keys();
    for (const key of keys.slice(0, Math.max(0, keys.length - MAX_IMAGES))) await cache.delete(key);
  }).catch(() => {});
  return writes;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('range') || url.pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate') {
    if (url.pathname !== '/') return;
    event.respondWith(caches.open(APP_CACHE).then(async cache => (await cache.match('/')) || fetch(request)));
  } else if (SHELL.includes(url.pathname)) {
    event.respondWith(caches.open(APP_CACHE).then(async cache => (await cache.match(url.pathname, { ignoreVary: true })) || fetch(request)));
  } else if (url.pathname.startsWith('/art/')) {
    const response = (async () => {
      const cache = await caches.open(ART_CACHE);
      const cached = await cache.match(request, { ignoreVary: true });
      if (cached) return { response: cached };
      try {
        const result = await fetch(request);
        return { response: result, copy: result.ok && result.headers.get('Content-Type')?.startsWith('image/') ? result.clone() : null };
      } catch {
        return { response: new Response('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="560"><rect width="640" height="560" fill="#faf6e8"/><text x="320" y="280" text-anchor="middle" fill="#66503d" font-size="28">联网后看看这张图片</text></svg>', { headers: { 'Content-Type': 'image/svg+xml' } }) };
      }
    })();
    event.respondWith(response.then(result => result.response));
    event.waitUntil(response.then(result => {
      if (result.copy) return storeImage(request, result.copy);
    }).catch(() => {}));
  }
});
