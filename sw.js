// Buku Keuangan — service worker: simpan tampilan agar cepat dibuka.
const CACHE = 'bk-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon.svg', './apple-touch-icon.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const host = new URL(r.url).hostname;
  if (host.endsWith('script.google.com') || host.endsWith('googleusercontent.com')) return; // data selalu dari jaringan
  e.respondWith(caches.open(CACHE).then((c) => c.match(r).then((hit) => {
    const net = fetch(r).then((res) => { if (res && (res.ok || res.type === 'opaque')) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});
