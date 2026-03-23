// Files to cache
const cacheName = "chronomanuel-0.2";
const appShellFiles = [
  "index.html",
  "main.js",
  "styles.css",
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
];

// Installing Service Worker
self.addEventListener("install", (e) => {
  console.log("[Service Worker] Install");
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log("[Service Worker] Caching all: app shell and content");
      await cache.addAll(appShellFiles);
    })()
  );
});

// Fetching content using Service Worker
self.addEventListener("fetch", (e) => {
  // Cache http and https only, skip unsupported chrome-extension:// and file://...
  if (
    !(e.request.url.startsWith("http:") || e.request.url.startsWith("https:"))
  ) {
    return;
  }

  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) return r;
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});

// Empty cache
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            console.log(
              `Cache ${key} est le cache actuel, aucun besoin de le supprimer.`
            );
            return;
          }
          console.log(`Suppression de l'ancien cache: ${key}`);
          return caches.delete(key);
        })
      );
    })
  );
});
