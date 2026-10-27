/* Lecture continue sans coupure (Web Audio).
 *
 * Les balises <audio> enchaînées laissent toujours un blanc entre deux
 * fichiers (démarrage du décodeur, réseau). Ici, chaque verset est
 * téléchargé puis décodé en mémoire, et le suivant est programmé sur
 * l'horloge audio exactement à la fin du précédent : l'enchaînement est
 * parfaitement continu. Le silence enregistré au début/fin de chaque
 * fichier est conservé (c'est la respiration naturelle du récitateur).
 * Deux versets d'avance sont toujours téléchargés.
 */

interface Morceau {
  buffer: AudioBuffer;
  debut: number; // début utile (silence rogné), en secondes
  fin: number; // fin utile
}

export interface RappelsLecture {
  /** Appelé au moment précis où le verset d'index i commence. */
  surVerset: (i: number) => void;
  /** Appelé quand le dernier verset est terminé. */
  surFin: () => void;
  /** Appelé si un fichier ne peut pas être lu. */
  surErreur: (i: number) => void;
}

const AVANCE = 2; // nombre de versets téléchargés d'avance
const ROGNER_SILENCE = false; // true = couper les blancs (transitions pressées)
const SEUIL_SILENCE = 0.012; // amplitude en dessous de laquelle c'est du silence
const MARGE_DEBUT = 0.06; // on garde un petit souffle avant le premier son
const MARGE_FIN = 0.1;

type ContexteAudio = typeof AudioContext;

export function lectureContinueDisponible(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { AudioContext?: ContexteAudio; webkitAudioContext?: ContexteAudio };
  return !!(w.AudioContext || w.webkitAudioContext) && typeof fetch === "function";
}

/** Vers le relais /api/audio si le serveur d'origine refuse le CORS. */
function urlRelais(url: string) {
  return `/api/audio?u=${encodeURIComponent(url)}`;
}

/** Petit WAV silencieux joué en boucle dans une balise <audio> : sur iPhone,
 *  cela bascule la session audio en mode « lecture », ce qui permet au Web
 *  Audio de sonner même avec l'interrupteur silencieux. */
function wavSilencieux(): string {
  const taux = 8000;
  const n = taux; // 1 s
  const buf = new ArrayBuffer(44 + n);
  const dv = new DataView(buf);
  const ecrire = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i));
  };
  ecrire(0, "RIFF");
  dv.setUint32(4, 36 + n, true);
  ecrire(8, "WAVE");
  ecrire(12, "fmt ");
  dv.setUint32(16, 16, true);
  dv.setUint16(20, 1, true);
  dv.setUint16(22, 1, true);
  dv.setUint32(24, taux, true);
  dv.setUint32(28, taux, true);
  dv.setUint16(32, 1, true);
  dv.setUint16(34, 8, true);
  ecrire(36, "data");
  dv.setUint32(40, n, true);
  for (let i = 0; i < n; i++) dv.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

export class LectureContinue {
  private ctx: AudioContext | null = null;
  private cache = new Map<string, Promise<Morceau>>();
  private sources: AudioBufferSourceNode[] = [];
  private minuteries: number[] = [];
  private session = 0;
  private urls: string[] = [];
  private silence: HTMLAudioElement | null = null;

  constructor(private rappels: RappelsLecture) {}

  /** À appeler depuis un geste utilisateur (clic) : crée/réveille le contexte. */
  private contexte(): AudioContext {
    if (!this.ctx) {
      const w = window as unknown as { AudioContext?: ContexteAudio; webkitAudioContext?: ContexteAudio };
      const C = (w.AudioContext || w.webkitAudioContext) as ContexteAudio;
      this.ctx = new C();
    }
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  private async telecharger(url: string): Promise<ArrayBuffer> {
    try {
      const r = await fetch(url, { mode: "cors" });
      if (!r.ok) throw new Error(String(r.status));
      return await r.arrayBuffer();
    } catch {
      const r = await fetch(urlRelais(url));
      if (!r.ok) throw new Error(String(r.status));
      return await r.arrayBuffer();
    }
  }

  private decoder(ctx: AudioContext, donnees: ArrayBuffer): Promise<AudioBuffer> {
    // Safari ancien : decodeAudioData ne renvoie pas de promesse
    return new Promise((ok, ko) => {
      const p = ctx.decodeAudioData(donnees, ok, ko);
      if (p && typeof (p as Promise<AudioBuffer>).then === "function") {
        (p as Promise<AudioBuffer>).then(ok, ko);
      }
    });
  }

  /** Rogne le silence de début et de fin. */
  private bornes(buffer: AudioBuffer): { debut: number; fin: number } {
    if (!ROGNER_SILENCE) return { debut: 0, fin: buffer.duration };
    const d = buffer.getChannelData(0);
    const taux = buffer.sampleRate;
    let premier = 0;
    while (premier < d.length && Math.abs(d[premier]) < SEUIL_SILENCE) premier++;
    let dernier = d.length - 1;
    while (dernier > premier && Math.abs(d[dernier]) < SEUIL_SILENCE) dernier--;
    if (premier >= dernier) return { debut: 0, fin: buffer.duration };
    return {
      debut: Math.max(0, premier / taux - MARGE_DEBUT),
      fin: Math.min(buffer.duration, dernier / taux + MARGE_FIN),
    };
  }

  private charger(url: string): Promise<Morceau> {
    const existant = this.cache.get(url);
    if (existant) return existant;
    const ctx = this.contexte();
    const p = this.telecharger(url)
      .then((donnees) => this.decoder(ctx, donnees))
      .then((buffer) => ({ buffer, ...this.bornes(buffer) }));
    p.catch(() => this.cache.delete(url));
    this.cache.set(url, p);
    return p;
  }

  /** Ne garde en mémoire que les versets autour de i. */
  private nettoyer(i: number) {
    for (let k = 0; k < i - 1; k++) this.cache.delete(this.urls[k]);
  }

  private precharger(i: number) {
    for (let k = i; k <= i + AVANCE && k < this.urls.length; k++) {
      this.charger(this.urls[k]).catch(() => {});
    }
  }

  private planifier(fn: () => void, dansSecondes: number) {
    const id = window.setTimeout(fn, Math.max(0, dansSecondes * 1000));
    this.minuteries.push(id);
  }

  /** Lance la lecture des fichiers `urls` à partir de l'index `depuis`. */
  demarrer(urls: string[], depuis = 0) {
    this.arreter();
    const session = ++this.session;
    this.urls = urls;
    const ctx = this.contexte();
    // Balise silencieuse pour iPhone (voir wavSilencieux)
    try {
      if (!this.silence) {
        this.silence = new Audio(wavSilencieux());
        this.silence.loop = true;
        this.silence.volume = 0.01;
      }
      this.silence.play().catch(() => {});
    } catch {
      /* sans importance */
    }
    this.enchainer(session, depuis, ctx.currentTime + 0.05);
  }

  private enchainer(session: number, i: number, quand: number) {
    if (session !== this.session) return;
    if (i >= this.urls.length) {
      const ctx = this.contexte();
      this.planifier(() => {
        if (session !== this.session) return;
        this.arreter();
        this.rappels.surFin();
      }, quand - ctx.currentTime);
      return;
    }
    this.precharger(i);
    this.charger(this.urls[i]).then(
      (m) => {
        if (session !== this.session) return;
        const ctx = this.contexte();
        const debut = Math.max(quand, ctx.currentTime + 0.02);
        const src = ctx.createBufferSource();
        src.buffer = m.buffer;
        src.connect(ctx.destination);
        const duree = m.fin - m.debut;
        src.start(debut, m.debut, duree);
        this.sources.push(src);
        src.onended = () => {
          this.sources = this.sources.filter((s) => s !== src);
        };
        const finPrevue = debut + duree;
        // Au moment où ce verset démarre : signaler, nettoyer, et programmer le suivant
        this.planifier(() => {
          if (session !== this.session) return;
          this.rappels.surVerset(i);
          this.nettoyer(i);
          this.enchainer(session, i + 1, finPrevue);
        }, debut - ctx.currentTime);
      },
      () => {
        if (session !== this.session) return;
        this.rappels.surErreur(i);
        // Un fichier manquant ne bloque pas la lecture : on passe au suivant
        this.enchainer(session, i + 1, this.contexte().currentTime + 0.05);
      }
    );
  }

  /** Coupe tout (sources programmées, minuteries). */
  arreter() {
    this.session++;
    for (const id of this.minuteries) window.clearTimeout(id);
    this.minuteries = [];
    for (const s of this.sources) {
      try {
        s.onended = null;
        s.stop();
      } catch {
        /* déjà terminée */
      }
    }
    this.sources = [];
    this.silence?.pause();
  }

  get enCours() {
    return this.sources.length > 0;
  }
}
