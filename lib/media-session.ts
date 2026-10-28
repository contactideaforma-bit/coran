/* Contrôles sur l'écran verrouillé / centre de contrôle (Media Session API).
   Déclarer une session « média » permet aussi à iOS de maintenir la lecture
   quand l'écran s'éteint ou que l'appli passe en arrière-plan. */

export interface InfosMedia {
  titre: string; // ex. « Al-Baqara — verset 12 »
  artiste?: string; // récitateur
  surLecture?: () => void;
  surPause?: () => void;
  surArret?: () => void;
  surPrecedent?: () => void;
  surSuivant?: () => void;
}

export function declarerMediaSession(infos: InfosMedia) {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  const ms = navigator.mediaSession;
  try {
    ms.metadata = new MediaMetadata({
      title: infos.titre,
      artist: infos.artiste ?? "",
      album: "My Easy Coran",
      artwork: [
        { src: "/icone-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icone-512.png", sizes: "512x512", type: "image/png" },
      ],
    });
    ms.playbackState = "playing";
    const lier = (action: MediaSessionAction, fn?: () => void) => {
      try {
        ms.setActionHandler(action, fn ? () => fn() : null);
      } catch {
        /* action non prise en charge */
      }
    };
    lier("play", infos.surLecture);
    lier("pause", infos.surPause);
    lier("stop", infos.surArret);
    lier("previoustrack", infos.surPrecedent);
    lier("nexttrack", infos.surSuivant);
  } catch {
    /* API indisponible */
  }
}

export function etatMediaSession(etat: "playing" | "paused" | "none") {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.playbackState = etat;
  } catch {
    /* ignoré */
  }
}

export function effacerMediaSession() {
  if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = "none";
  } catch {
    /* ignoré */
  }
}
