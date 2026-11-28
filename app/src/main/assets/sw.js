// Shaab Hadramout Service Worker
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch { data = {body:event.data?.text() || ''}; }
    await self.registration.showNotification(data.title || 'نادي شعب حضرموت', {
      body: data.body || 'لديك تحديث جديد من النادي', icon: 'images/icon-192.png', badge: 'images/icon-192.png',
      dir: 'rtl', lang: 'ar', data: {url: data.url || './'}
    });
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.registration.scope).href;
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for (const client of clientsList) { if ('focus' in client) { await client.focus(); if ('navigate' in client) await client.navigate(target); return; } }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
const CACHE_NAME = 'shaab-hadramout-v24';
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
    const refreshMedia = caches.open(MEDIA_CACHE).then((cache) =>
      fetch(request).then((response) => {
        if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone()).catch(() => {});
        return response;
      }).catch(() => null)
    );
    event.waitUntil(refreshMedia.then(() => undefined));
    event.respondWith((async () => {
      const cache = await caches.open(MEDIA_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      return (await refreshMedia) || new Response('', { status: 503, statusText: 'Offline media unavailable' });
    })());
    return;
  }

  // Cache external stylesheets and font files (Font Awesome + Google Fonts)
  // so the app keeps its icons and typography when launched offline.
  if (request.destination === 'style' || request.destination === 'font') {
    const refreshExternalAsset = caches.open(CACHE_NAME).then((cache) =>
      fetch(request).then((response) => {
        if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone()).catch(() => {});
        return response;
      }).catch(() => null)
    );
    event.waitUntil(refreshExternalAsset.then(() => undefined));
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      return (await refreshExternalAsset) || new Response('', { status: 503, statusText: 'Offline style/font unavailable' });
    })());
    return;
  }

  // App shell: prefer the saved copy, while updating it when a connection exists.
  if (new URL(request.url).origin === self.location.origin) {
    const refreshShell = caches.open(CACHE_NAME).then((cache) =>
      fetch(request).then((response) => {
        if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
        return response;
      }).catch(() => null)
    );
    event.waitUntil(refreshShell.then(() => undefined));
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      return (await refreshShell) || new Response('غير متصل بالإنترنت', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
  }
});
