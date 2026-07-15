"use client";

/* Abonnement aux notifications push (rappel de prière appli fermée).
 * Nécessite NEXT_PUBLIC_VAPID_PUBLIC_KEY côté client ; sans elle,
 * l'appli retombe silencieusement sur le rappel local (appli ouverte). */

import type { ConfigPriere } from "@/lib/prieres";

export const pushSupporte = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

/** base64url → Uint8Array (clé serveur VAPID). */
function versUint8(b64url: string): Uint8Array {
  const rembourrage = "=".repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + rembourrage).replace(/-/g, "+").replace(/_/g, "/");
  const brut = atob(b64);
  const octets = new Uint8Array(brut.length);
  for (let i = 0; i < brut.length; i++) octets[i] = brut.charCodeAt(i);
  return octets;
}

/** Le service worker « prêt », avec délai maxi (jamais prêt en dev). */
const swPret = () =>
  Promise.race<ServiceWorkerRegistration | null>([
    navigator.serviceWorker.ready,
    new Promise<null>((res) => setTimeout(() => res(null), 5000)),
  ]);

/** S'abonner (ou mettre à jour la ville) — renvoie true si le push est actif. */
export async function abonnerPush(config: ConfigPriere): Promise<boolean> {
  try {
    if (!pushSupporte()) return false;
    const reg = await swPret();
    if (!reg) return false;
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: versUint8(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ) as unknown as ArrayBuffer,
      }));
    const res = await fetch("/api/abonnements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sub: sub.toJSON(), ...config }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function desabonnerPush(): Promise<void> {
  try {
    if (!pushSupporte()) return;
    const reg = await swPret();
    const sub = await reg?.pushManager.getSubscription();
    if (!sub) return;
    await fetch("/api/abonnements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    }).catch(() => {});
    await sub.unsubscribe();
  } catch {}
}
