/* Notifications : prières et rappels Coran.
 *
 * Deux niveaux :
 * 1. Web Push (appli fermée) : l'appareil s'abonne via le service worker,
 *    l'abonnement + les réglages sont envoyés à /api/push/abonnement, et un
 *    cron appelle /api/push/envoyer chaque minute pour expédier les notifs.
 * 2. Secours local (composant RappelPriere) : minuteurs tant que l'appli est
 *    ouverte, utilisé seulement si le push n'est pas disponible/activé.
 *
 * Sur iPhone, tout cela n'existe que si l'appli est installée sur l'écran
 * d'accueil (iOS 16.4+). */

import { lireConfigPriere } from "./prieres";
import { lireConfigNotifs, type Abonne } from "./rappels";

const CLE = "coran-notif-priere"; // "1" = l'utilisateur a activé les rappels
const CLE_PUSH = "coran-push"; // "1" = abonné au push côté serveur

export const CLE_PUBLIQUE_VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/** Le navigateur sait-il afficher des notifications ? */
export const notifsSupportees = () =>
  typeof window !== "undefined" && "Notification" in window;

/** Le navigateur ET le serveur sont-ils prêts pour le Web Push ? */
export const pushSupporte = () =>
  notifsSupportees() &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  CLE_PUBLIQUE_VAPID.length > 0;

/** L'utilisateur a activé les rappels ET la permission est accordée. */
export function notifsActivees(): boolean {
  try {
    return (
      notifsSupportees() &&
      localStorage.getItem(CLE) === "1" &&
      Notification.permission === "granted"
    );
  } catch {
    return false;
  }
}

/** Abonné au push (les notifs partent du serveur, appli fermée comprise). */
export function pushActif(): boolean {
  try {
    return notifsActivees() && localStorage.getItem(CLE_PUSH) === "1";
  } catch {
    return false;
  }
}

export async function demanderPermission(): Promise<boolean> {
  if (!notifsSupportees()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const p = await Notification.requestPermission();
  return p === "granted";
}

/* ===== Abonnement push ===== */

const versUint8 = (base64: string) => {
  const rembourrage = "=".repeat((4 - (base64.length % 4)) % 4);
  const b = (base64 + rembourrage).replace(/-/g, "+").replace(/_/g, "/");
  const brut = atob(b);
  return Uint8Array.from(brut, (c) => c.charCodeAt(0));
};

/** Identifiant stable de l'appareil, dérivé de l'endpoint (jamais l'URL entière). */
async function idAbonne(endpoint: string) {
  const data = new TextEncoder().encode(endpoint);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function abonnementCourant(): Promise<PushSubscription | null> {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return null;
    return await reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/** Envoie (ou renvoie) l'abonnement et les réglages au serveur. */
async function envoyerAuServeur(sub: PushSubscription) {
  const abonne: Abonne = {
    id: await idAbonne(sub.endpoint),
    abonnement: sub.toJSON(),
    fuseau: Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Paris",
    priere: lireConfigPriere(),
    notifs: lireConfigNotifs(),
    maj: Date.now(),
  };
  const res = await fetch("/api/push/abonnement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(abonne),
  });
  if (!res.ok) throw new Error("Serveur push indisponible");
}

/** Active les rappels : permission, puis abonnement push si possible.
 *  Renvoie le mode obtenu. */
export async function activerNotifs(): Promise<"push" | "local" | "refuse"> {
  const ok = await demanderPermission();
  if (!ok) return "refuse";
  try {
    localStorage.setItem(CLE, "1");
  } catch {}

  if (pushSupporte()) {
    try {
      const reg =
        (await navigator.serviceWorker.getRegistration()) ??
        (await navigator.serviceWorker.register("/sw.js"));
      await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: versUint8(CLE_PUBLIQUE_VAPID),
        }));
      await envoyerAuServeur(sub);
      localStorage.setItem(CLE_PUSH, "1");
      window.dispatchEvent(new Event("notifs-priere-changees"));
      return "push";
    } catch {
      // Le push a échoué (serveur non configuré, navigateur récalcitrant…) :
      // on retombe sur les rappels locaux.
    }
  }
  try {
    localStorage.setItem(CLE_PUSH, "0");
  } catch {}
  window.dispatchEvent(new Event("notifs-priere-changees"));
  return "local";
}

/** Coupe tout : plus de push côté serveur, plus de rappels locaux. */
export async function desactiverNotifs() {
  try {
    localStorage.setItem(CLE, "0");
    localStorage.setItem(CLE_PUSH, "0");
  } catch {}
  const sub = await abonnementCourant();
  if (sub) {
    try {
      await fetch("/api/push/abonnement", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: await idAbonne(sub.endpoint) }),
      });
    } catch {}
    try {
      await sub.unsubscribe();
    } catch {}
  }
  window.dispatchEvent(new Event("notifs-priere-changees"));
}

/** À appeler quand la ville ou les réglages changent : met le serveur à jour. */
export async function synchroniserAbonnement() {
  if (!pushActif()) return;
  const sub = await abonnementCourant();
  if (!sub) return;
  try {
    await envoyerAuServeur(sub);
  } catch {}
}

/* ===== Compatibilité : anciens appels ===== */

/** @deprecated utiliser activerNotifs / desactiverNotifs */
export function ecrireNotifs(actif: boolean) {
  if (actif) activerNotifs();
  else desactiverNotifs();
}

/** Affiche une notification locale (mode secours ou test). */
export async function montrerNotification(
  titre: string,
  corps: string,
  url = "/"
) {
  if (!notifsSupportees() || Notification.permission !== "granted") return;
  const options: NotificationOptions = {
    body: corps,
    icon: "/icone-192.png",
    badge: "/icone-192.png",
    data: { url },
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(titre, options);
      return;
    }
  } catch {}
  try {
    new Notification(titre, options);
  } catch {}
}
