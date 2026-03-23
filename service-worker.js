// Définis le nom de ton cache
const version = "v0.2";
const cacheName = `CM-cache-${version}`;

// Liste des fichiers à mettre en cache
const filesToCache = [
  "/dev/chrono-manuel/",
  "/dev/chrono-manuel/index.html",
  "/dev/chrono-manuel/manifest.json",
  "/dev/chrono-manuel/styles.css",
  "/dev/chrono-manuel/main.js",
  "/dev/chrono-manuel/images/icon-192x192.png",
  "/dev/chrono-manuel/images/icon-512x512.png",
  // Ajoute d'autres fichiers statiques ici (CSS, JS, images, etc.)
];

// Événement 'install' du service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      // Ajoute les fichiers à la cache
      return cache.addAll(filesToCache);
    })
  );
});

// Événement 'activate' du service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            // Supprime les anciens caches
            return caches.delete(name);
          }
        })
      );
    })
  );
});
// Événement 'fetch' du service worker
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Essaye de trouver la requête dans le cache
    caches.match(event.request).then((response) => {
      // Retourne la réponse du cache si elle existe
      return response || fetch(event.request);
    })
  );
});
