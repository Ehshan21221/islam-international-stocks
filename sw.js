// Islam International Stocks — service worker
// Caches the app shell so it opens instantly and works offline.
// Stock DATA itself is synced live through Firestore, not cached here.

const CACHE_NAME = 'ii-stocks-shell-v1';
const SHELL_FILES = [
  './index.html',
  './config.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/logo-header.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Never cache Firebase/Firestore network calls — those must always be live.
  if (url.origin.includes('firestore') || url.origin.includes('googleapis') || url.origin.includes('firebaseapp')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
