/* Service worker — cache hors-ligne de My Easy Muslim.
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

/* ===== Notifications push (rappel de prière, appli fermée) ===== */
self.addEventListener("push", (event) => {
  let donnees = {};
  try {
    donnees = event.data ? event.data.json() : {};
  } catch {}
  event.waitUntil(
    self.registration.showNotification(donnees.titre || "My Easy Muslim", {
      body: donnees.corps || "",
      icon: "/icone-192.png",
      badge: "/icone-192.png",
      tag: donnees.tag || "priere",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((fenetres) => {
      const ouverte = fenetres.find((f) => "focus" in f);
      if (ouverte) return ouverte.focus();
      return clients.openWindow("/prieres");
    })
  );
});
