const CACHE_VERSION = '1.0.9';
const CACHE_NAMES = {
  app: `qr-scan-app-${CACHE_VERSION}`,
  cdn: `qr-scan-cdn-${CACHE_VERSION}`,
  images: `qr-scan-images-${CACHE_VERSION}`
};

// App Shell: cache ngay khi install
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-256.svg',
  './assets/icons/icon-512.svg'
];

// CDN resources cần cache sẵn
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.app).then((cache) => cache.addAll(APP_SHELL)),
      caches.open(CACHE_NAMES.cdn).then((cache) => cache.addAll(CDN_ASSETS))
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !Object.values(CACHE_NAMES).includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Stale-while-revalidate: trả về cache ngay, update cache ở background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

// Cache-first: ưu tiên cache, fallback sang network
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // App Shell (HTML, manifest, icons nội bộ) -> stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event.request, CACHE_NAMES.app));
    return;
  }

  // CDN static assets (CSS, JS) -> cache-first
  if (
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(cacheFirst(event.request, CACHE_NAMES.cdn));
    return;
  }

  // Hình ảnh (Unsplash, ảnh nội bộ) -> cache-first
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|avif)$/i) || url.hostname.includes('unsplash.com')) {
    event.respondWith(
      cacheFirst(event.request, CACHE_NAMES.images).catch(() => fetch(event.request))
    );
    return;
  }

  // Các request khác -> network-first
  event.respondWith(fetch(event.request));
});
