/* Notifications locales pour l'heure de la prière.
 * Version « appli ouverte » : le rappel part tant que l'appli est
 * ouverte (onglet ou PWA). Les push serveur (appli fermée) pourront
 * s'ajouter plus tard sans changer cette interface. */

const CLE = "coran-notif-priere";

/** Le navigateur sait-il afficher des notifications ?
 *  (Sur iPhone : seulement si l'appli est installée sur l'écran d'accueil.) */
export const notifsSupportees = () =>
  typeof window !== "undefined" && "Notification" in window;

/** L'utilisateur a activé le rappel ET la permission est accordée. */
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

export function ecrireNotifs(actif: boolean) {
  try {
    localStorage.setItem(CLE, actif ? "1" : "0");
  } catch {}
  // Prévenir le planificateur (RappelPriere) du changement
  window.dispatchEvent(new Event("notifs-priere-changees"));
}

export async function demanderPermission(): Promise<boolean> {
  if (!notifsSupportees()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const p = await Notification.requestPermission();
  return p === "granted";
}

export async function montrerNotification(titre: string, corps: string) {
  if (!notifsSupportees() || Notification.permission !== "granted") return;
  const options: NotificationOptions = {
    body: corps,
    icon: "/icone-192.png",
    badge: "/icone-192.png",
  };
  // Via le service worker si possible (plus fiable sur Android)
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
