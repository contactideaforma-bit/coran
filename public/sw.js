/* Service worker — cache hors-ligne de My Easy Muslim.
 * Texte des sourates (API Quran.com), polices et pages visitées
 * restent disponibles sans connexion après une première visite.
 * (L'audio n'est pas mis en cache pour préserver l'espace de stockage.)
 */
const CACHE = "my-easy-muslim-v4";

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

  // Vidéos de fond et requêtes partielles (Range) : laisser le navigateur
  // les gérer directement (sinon la lecture vidéo casse sur iPhone).
  if (url.pathname.startsWith("/fonds/") || req.headers.has("range")) return;

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

/* ===== Notifications push (prières, rappels Coran) ===== */

self.addEventListener("push", (event) => {
  let d = {};
  try {
    d = event.data ? event.data.json() : {};
  } catch {
    d = { titre: "My Easy Muslim", corps: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(d.titre || "My Easy Muslim", {
      body: d.corps || "",
      icon: "/icone-192.png",
      badge: "/icone-192.png",
      tag: d.tag || undefined,
      data: { url: d.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    (async () => {
      const fenetres = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const f of fenetres) {
        if ("focus" in f) {
          await f.focus();
          if ("navigate" in f) {
            try {
              await f.navigate(url);
            } catch {}
          }
          return;
        }
      }
      await self.clients.openWindow(url);
    })()
  );
});

/* Le navigateur a renouvelé l'abonnement : on prévient le serveur. */
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const ancien = event.oldSubscription;
        const nouveau =
          event.newSubscription ||
          (await self.registration.pushManager.subscribe(
            ancien ? ancien.options : { userVisibleOnly: true }
          ));
        await fetch("/api/push/abonnement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            renouvellement: true,
            ancienEndpoint: ancien ? ancien.endpoint : null,
            abonnement: nouveau.toJSON(),
          }),
        });
      } catch {}
    })()
  );
});
