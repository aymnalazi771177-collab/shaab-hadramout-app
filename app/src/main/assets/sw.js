// Shaab Hadramout Service Worker
const CACHE_NAME = 'shaab-hadramout-v2';
const MEDIA_CACHE = 'shaab-hadramout-media-v1';
const ASSETS = [
  'index.html',
  'css/style.css',
  'js/app.js',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME && key !== MEDIA_CACHE).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Keep images, video posters, and audio files that the user has already opened.
  if (request.destination === 'image' || request.destination === 'video' || request.destination === 'audio') {
    event.respondWith((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      const cached = await cache.match(request);
      const network = fetch(request).then((response) => {
        if (response && (response.ok || response.type === 'opaque')) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      }).catch(() => null);
      if (cached) {
        event.waitUntil(network.then(() => undefined));
        return cached;
      }
      const response = await network;
      return response || new Response('', { status: 503, statusText: 'Offline media unavailable' });
    })());
    return;
  }

  // App shell: prefer the saved copy, while updating it when a connection exists.
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const network = fetch(request).then((response) => {
        if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
        return response;
      }).catch(() => null);
      if (cached) {
        event.waitUntil(network.then(() => undefined));
        return cached;
      }
      return (await network) || new Response('غير متصل بالإنترنت', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
  }
});
