// Islam International Stocks — service worker
// Caches the app shell so it opens instantly and works offline.
// Stock DATA itself is synced live through Firestore, not cached here.

const CACHE_NAME = 'ii-stocks-shell-v5';
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

  const isAppShell = event.request.mode === 'navigate' ||
    url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('config.js') ||
    url.pathname.endsWith('manifest.json');

  if (isAppShell) {
    // Network-first: always try to get the latest version when online, so
    // updates uploaded to GitHub show up the very next time the app is opened.
    // Falls back to the last cached copy only when there's no connection.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Icons and other static assets rarely change — cache-first is fine for these.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
