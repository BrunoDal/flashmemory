/*
 * Flashmemory's service worker deliberately stays dependency-free. Vite emits
 * hashed assets, so the document shell is precached and build assets are
 * filled into the versioned runtime cache as the browser requests them.
 */
const CACHE_PREFIX = 'flashmemory-cache-';
const CACHE_VERSION = 'v2';
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;
const appUrl = (path) => new URL(path, self.registration.scope).toString();
const APP_SHELL_URL = appUrl('index.html');
const SHELL_URLS = ['.', 'index.html', 'manifest.webmanifest', 'icon.svg'].map(appUrl);
const ASSET_DESTINATIONS = new Set(['script', 'style', 'image', 'font', 'worker', 'audio', 'video']);

const isSameOrigin = (request) => new URL(request.url).origin === self.location.origin;
const isNavigation = (request) => request.mode === 'navigate';
const isCacheableResponse = (response) => response.ok || response.type === 'opaque';

const cacheResponse = async (request, response) => {
  if (isCacheableResponse(response)) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      // The first install must become active so the next offline launch is
      // controlled. Subsequent versions wait for the user-facing CTA.
      .then(() => { if (!self.registration.active) self.skipWaiting(); }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

// The app owns the timing of activation so it can offer an accessible update CTA.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || !isSameOrigin(request)) return;

  if (isNavigation(request)) {
    // Prefer a fresh document so a new build can be discovered. Only a failed
    // network navigation falls back to the cached shell; HTTP errors are passed
    // through instead of being masked by an unrelated app document.
    event.respondWith(
      fetch(request)
        .then((response) => cacheResponse(new Request(APP_SHELL_URL), response))
        .catch(() => caches.match(APP_SHELL_URL)),
    );
    return;
  }

  // Runtime caching is limited to same-origin browser assets. API calls and
  // other non-asset requests remain network-only and never receive index.html.
  if (!ASSET_DESTINATIONS.has(request.destination)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => cacheResponse(request, response));
    }),
  );
});
