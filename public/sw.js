/* Service worker — cache hors-ligne de Coran Tajwid.
 * Texte des sourates (API Quran.com), polices et pages visitées
 * restent disponibles sans connexion après une première visite.
 * (L'audio n'est pas mis en cache pour préserver l'espace de stockage.)
 */
const CACHE = "my-easy-muslim-v3";

const HOTES_DONNEES = [
  "api.quran.com",
  "static.quranwbw.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cles = await caches.keys();
      await Promise.all(
        cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Données + polices : cache d'abord (le texte du Coran ne change pas)
  if (HOTES_DONNEES.includes(url.hostname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const enCache = await cache.match(req);
        if (enCache) return enCache;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      })()
    );
    return;
  }

  // Pages et assets de l'appli : réseau d'abord, cache en secours
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          const enCache = await cache.match(req);
          if (enCache) return enCache;
          throw new Error("hors-ligne");
        }
      })()
    );
  }
});
