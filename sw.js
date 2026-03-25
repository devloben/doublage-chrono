const CACHE_NAME = "doublageChrono-v0.5.5";
const APP_SHELL_FILES = [
  "./",
  "index.html",
  "styles.css",
  "main.js",
  "chronomanuel.webmanifest",
  "ressources/icons/favicon.ico",
  "ressources/icons/favicon-16x16.png",
  "ressources/icons/favicon-32x32.png",
  "ressources/icons/favicon-96x96.png",
  "ressources/icons/favicon-256x256.png",
  "ressources/icons/apple-icon-57x57.png",
  "ressources/icons/apple-icon-60x60.png",
  "ressources/icons/apple-icon-72x72.png",
  "ressources/icons/apple-icon-76x76.png",
  "ressources/icons/apple-icon-114x114.png",
  "ressources/icons/apple-icon-120x120.png",
  "ressources/icons/apple-icon-144x144.png",
  "ressources/icons/apple-icon-152x152.png",
  "ressources/icons/apple-icon-180x180.png",
  "ressources/icons/ms-icon-70x70.png",
  "ressources/icons/ms-icon-144x144.png",
  "ressources/icons/ms-icon-150x150.png",
  "ressources/icons/ms-icon-310x310.png",
  "ressources/icons/android-icon-36x36.png",
  "ressources/icons/android-icon-48x48.png",
  "ressources/icons/android-icon-72x72.png",
  "ressources/icons/android-icon-96x96.png",
  "ressources/icons/android-icon-144x144.png",
  "ressources/icons/android-icon-192x192.png",
  "ressources/icons/android-icon-512x512.png",
  "ressources/img/screenshot.png",
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_FILES)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request);
    }),
  );
});
