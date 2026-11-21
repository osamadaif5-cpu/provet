// تطبيق PROVET: كل فتحة بتجيب آخر نسخة وآخر داتا من النت، ولو مفيش نت بتفتح بآخر نسخة اتحفظت على الموبايل
const C = 'provet-app';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'version.json', 'data/logins.json'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => Promise.all(CORE.map(u => fetch(u, { cache: 'no-store' }).then(r => r.ok ? c.put(new URL(u, self.location).href.split('?')[0], r) : null).catch(() => null))))); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(C), key = r.url.split('?')[0];
    try {
      const res = await fetch(r, { cache: 'no-store' });
      if (res && res.ok) await cache.put(key, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(key);
      if (hit) return hit;
      throw err;
    }
  })());
});
