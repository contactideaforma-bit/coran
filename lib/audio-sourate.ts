/* Audio d'une sourate entière (un seul fichier, récitation d'origine) avec
 * le minutage de chaque verset — fourni par api.quran.com
 * (chapter_recitations). Permet de lire une sourate ou une plage de
 * versets consécutifs avec les vraies transitions du récitateur, sans
 * aucune coupure. Les récitateurs absents de quran.com retombent sur
 * l'enchaînement verset par verset (lib/lecture-continue.ts). */

/** Correspondance dossier everyayah (prefs.recitateur) → id de récitation quran.com */
export const RECITATIONS_QURAN_COM: Record<string, number> = {
  Husary_128kbps: 6,
  Abdul_Basit_Murattal_192kbps: 2,
  Minshawy_Murattal_128kbps: 9,
  "Abdurrahmaan_As-Sudais_192kbps": 3,
  "Saood_ash-Shuraym_128kbps": 10,
  Alafasy_128kbps: 7,
  "Abu_Bakr_Ash-Shaatree_128kbps": 4,
  Hani_Rifai_192kbps: 5,
};

export interface MinutageVerset {
  v: number;
  de: number; // secondes
  a: number; // secondes
}

export interface AudioSourate {
  url: string;
  minutages: MinutageVerset[];
}

const cache = new Map<string, Promise<AudioSourate | null>>();

/** Fichier audio complet + minutages, ou null si le récitateur n'est pas disponible. */
export function chargerAudioSourate(
  recitateur: string,
  sourate: number
): Promise<AudioSourate | null> {
  const id = RECITATIONS_QURAN_COM[recitateur];
  if (!id) return Promise.resolve(null);
  const cle = `${id}-${sourate}`;
  const existant = cache.get(cle);
  if (existant) return existant;
  const p = fetch(
    `https://api.quran.com/api/v4/chapter_recitations/${id}/${sourate}?segments=true`
  )
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((json) => {
      const f = json.audio_file as {
        audio_url: string;
        timestamps?: { verse_key: string; timestamp_from: number; timestamp_to: number }[];
      };
      if (!f?.audio_url || !f.timestamps?.length) return null;
      const minutages: MinutageVerset[] = f.timestamps
        .map((t) => ({
          v: Number(t.verse_key.split(":")[1]),
          de: t.timestamp_from / 1000,
          a: t.timestamp_to / 1000,
        }))
        .filter((m) => Number.isFinite(m.v) && Number.isFinite(m.de) && Number.isFinite(m.a))
        .sort((x, y) => x.v - y.v);
      return { url: f.audio_url, minutages };
    })
    .catch(() => null);
  cache.set(cle, p);
  p.then((r) => {
    if (r === null) cache.delete(cle);
  });
  return p;
}

export function minutageDe(audio: AudioSourate, v: number) {
  return audio.minutages.find((m) => m.v === v) ?? null;
}

export interface RappelsPlage {
  /** Le verset en cours de récitation change */
  surVerset?: (v: number) => void;
  /** Fin de la plage demandée (ou fin du fichier) */
  surFin: () => void;
  surErreur: () => void;
}

/** Lecteur d'une plage de versets dans le fichier complet d'une sourate. */
export class LecteurPlage {
  readonly element: HTMLAudioElement;
  private session = 0;
  private boucle: number | null = null;
  private rappelsCourants: RappelsPlage | null = null;

  constructor() {
    this.element = new Audio();
    this.element.preload = "auto";
    // Dans le document (caché) : iOS maintient mieux la lecture en
    // arrière-plan pour un élément présent dans la page.
    if (typeof document !== "undefined") {
      this.element.setAttribute("aria-hidden", "true");
      this.element.style.display = "none";
      document.body.appendChild(this.element);
    }
  }

  /** Lit du verset `de` au verset `a` (inclus). */
  jouer(audio: AudioSourate, de: number, a: number, rappels: RappelsPlage) {
    this.arreter();
    const session = ++this.session;
    const debut = minutageDe(audio, de);
    const fin = minutageDe(audio, a) ?? debut;
    if (!debut || !fin) {
      rappels.surErreur();
      return;
    }
    const el = this.element;
    const tFin = fin.a;
    let versetCourant = -1;

    const surveiller = () => {
      if (session !== this.session) return;
      if (this.boucle !== null) {
        window.clearTimeout(this.boucle);
        this.boucle = null;
      }
      if (el.paused && !el.ended) return; // en pause : on repartira avec reprendre()
      const t = el.currentTime;
      if (t >= tFin - 0.03 || el.ended) {
        el.pause();
        rappels.surFin();
        return;
      }
      // Verset en cours (les minutages sont triés)
      let v = debut.v;
      for (const m of audio.minutages) {
        if (m.v < debut.v) continue;
        if (t >= m.de) v = m.v;
        else break;
      }
      if (v !== versetCourant) {
        versetCourant = v;
        rappels.surVerset?.(v);
      }
      this.boucle = window.setTimeout(surveiller, 60);
    };

    el.onerror = () => {
      if (session === this.session) rappels.surErreur();
    };
    el.onended = () => {
      if (session === this.session) surveiller();
    };
    el.ontimeupdate = () => {
      if (session === this.session) surveiller();
    };
    this.rappelsCourants = rappels;

    if (el.src !== audio.url) {
      el.src = audio.url;
      el.load();
    }
    // Se placer au début de la plage dès que les métadonnées sont connues
    // (avant tout son), puis lancer la lecture tout de suite : play() doit
    // être appelé dans le geste utilisateur pour être accepté sur iPhone.
    const placer = () => {
      if (session !== this.session) return;
      try {
        el.currentTime = debut.de;
      } catch {
        /* position non modifiable : on partira du début */
      }
    };
    if (el.readyState >= 1) placer();
    else el.addEventListener("loadedmetadata", placer, { once: true });
    el.play().then(
      () => {
        if (session !== this.session) return;
        surveiller();
      },
      () => {
        if (session === this.session) rappels.surErreur();
      }
    );
  }

  /** Télécharge le fichier à l'avance (sans le jouer). */
  precharger(audio: AudioSourate) {
    if (this.element.src !== audio.url && this.element.paused) {
      this.element.src = audio.url;
      this.element.load();
    }
  }

  pause() {
    this.element.pause();
    if (this.boucle !== null) {
      window.clearTimeout(this.boucle);
      this.boucle = null;
    }
  }

  /** Reprend après une pause (depuis le bouton ou l'écran verrouillé). */
  reprendre() {
    const el = this.element;
    const rappels = this.rappelsCourants;
    if (!rappels) return;
    el.play().catch(() => rappels.surErreur());
  }

  arreter() {
    this.session++;
    if (this.boucle !== null) {
      window.clearTimeout(this.boucle);
      this.boucle = null;
    }
    this.element.pause();
    this.element.onended = null;
    this.element.onerror = null;
    this.element.ontimeupdate = null;
    this.rappelsCourants = null;
  }

  get enLecture() {
    return !this.element.paused;
  }
}
