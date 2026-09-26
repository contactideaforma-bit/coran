/* Sons d'ambiance nature synthétisés en direct (Web Audio) : aucun fichier,
   aucun droit d'auteur, fonctionne hors ligne. Utilisés sous les hadiths et
   les invocations du Scroll halal (jamais pendant une récitation). */

export type SonAmbiance = "vagues" | "pluie" | "vent" | "ruisseau" | "grillons" | "oiseaux";

interface Couche {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
  minuteries: number[];
}

export class Ambiance {
  private ctx: AudioContext | null = null;
  private sortie: GainNode | null = null;
  private bruit: AudioBuffer | null = null;
  private couche: Couche | null = null;
  private courant: SonAmbiance | null = null;

  /** À appeler dans un geste de l'utilisateur (sinon le navigateur bloque le son). */
  deverrouiller() {
    if (!this.ctx) {
      const C =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return;
      this.ctx = new C();
      this.sortie = this.ctx.createGain();
      this.sortie.gain.value = 0.9;
      this.sortie.connect(this.ctx.destination);
      const n = this.ctx.sampleRate * 3;
      this.bruit = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = this.bruit.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    void this.ctx.resume();
  }

  jouer(son: SonAmbiance) {
    if (!this.ctx || !this.sortie || this.courant === son) return;
    this.eteindre();
    this.courant = son;
    const ctx = this.ctx;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.5);
    gain.connect(this.sortie);
    const c: Couche = { gain, sources: [], minuteries: [] };
    this.couche = c;
    CONSTRUCTEURS[son](this, c);
  }

  arreter() {
    this.eteindre();
    this.courant = null;
  }

  /** Fondu de sortie de la couche en cours puis libération. */
  private eteindre() {
    const c = this.couche;
    const ctx = this.ctx;
    this.couche = null;
    if (!c || !ctx) return;
    c.minuteries.forEach((t) => clearTimeout(t));
    c.minuteries = [];
    c.gain.gain.cancelScheduledValues(ctx.currentTime);
    c.gain.gain.setValueAtTime(c.gain.gain.value, ctx.currentTime);
    c.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => {
      c.sources.forEach((s) => {
        try {
          s.stop();
        } catch {}
      });
      c.gain.disconnect();
    }, 900);
  }

  /* ----- briques ----- */

  get contexte() {
    return this.ctx!;
  }

  bruitBlanc(c: Couche) {
    const s = this.ctx!.createBufferSource();
    s.buffer = this.bruit;
    s.loop = true;
    s.loopStart = Math.random();
    s.start(0, Math.random() * 2);
    c.sources.push(s);
    return s;
  }

  filtre(type: BiquadFilterType, freq: number, q = 0.7) {
    const f = this.ctx!.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  volume(v: number) {
    const g = this.ctx!.createGain();
    g.gain.value = v;
    return g;
  }

  /** Oscillation lente d'un paramètre (houle, rafales…). */
  lfo(c: Couche, param: AudioParam, freq: number, amplitude: number) {
    const o = this.ctx!.createOscillator();
    o.frequency.value = freq;
    const g = this.volume(amplitude);
    o.connect(g).connect(param);
    o.start();
    c.sources.push(o);
  }

  /** Bref son sinusoïdal glissant (chant d'oiseau, grillon). */
  note(c: Couche, depart: number, f1: number, f2: number, duree: number, vol: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f1, depart);
    o.frequency.exponentialRampToValueAtTime(f2, depart + duree);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, depart);
    g.gain.linearRampToValueAtTime(vol, depart + duree * 0.3);
    g.gain.linearRampToValueAtTime(0, depart + duree);
    o.connect(g).connect(c.gain);
    o.start(depart);
    o.stop(depart + duree + 0.05);
  }

  /** Répète `fn` à intervalle aléatoire tant que la couche est active. */
  boucle(c: Couche, min: number, max: number, fn: () => void) {
    const tic = () => {
      if (this.couche !== c) return;
      fn();
      c.minuteries.push(window.setTimeout(tic, min + Math.random() * (max - min)));
    };
    c.minuteries.push(window.setTimeout(tic, 300 + Math.random() * min));
  }

  ventLeger(c: Couche, vol: number) {
    const f = this.filtre("bandpass", 450, 0.6);
    const g = this.volume(vol);
    this.bruitBlanc(c).connect(f).connect(g).connect(c.gain);
    this.lfo(c, f.frequency, 0.05, 180);
    this.lfo(c, g.gain, 0.11, vol * 0.5);
  }
}

const CONSTRUCTEURS: Record<SonAmbiance, (a: Ambiance, c: Couche) => void> = {
  vagues(a, c) {
    const f = a.filtre("lowpass", 550);
    const g = a.volume(0.28);
    a.bruitBlanc(c).connect(f).connect(g).connect(c.gain);
    a.lfo(c, g.gain, 0.085, 0.22);
    a.lfo(c, f.frequency, 0.085, 260);
  },
  pluie(a, c) {
    const hp = a.filtre("highpass", 800);
    const lp = a.filtre("lowpass", 7000);
    const g = a.volume(0.16);
    a.bruitBlanc(c).connect(hp).connect(lp).connect(g).connect(c.gain);
    const bp = a.filtre("bandpass", 2600, 0.5);
    const g2 = a.volume(0.05);
    a.bruitBlanc(c).connect(bp).connect(g2).connect(c.gain);
    a.lfo(c, g.gain, 0.07, 0.04);
  },
  vent(a, c) {
    a.ventLeger(c, 0.3);
  },
  ruisseau(a, c) {
    const f = a.filtre("bandpass", 1100, 0.6);
    const g = a.volume(0.12);
    a.bruitBlanc(c).connect(f).connect(g).connect(c.gain);
    const f2 = a.filtre("bandpass", 3200, 2.5);
    const g2 = a.volume(0.05);
    a.bruitBlanc(c).connect(f2).connect(g2).connect(c.gain);
    a.boucle(c, 90, 160, () => {
      const t = a.contexte.currentTime;
      g2.gain.setTargetAtTime(0.02 + Math.random() * 0.11, t, 0.04);
      f2.frequency.setTargetAtTime(2400 + Math.random() * 1800, t, 0.05);
    });
  },
  grillons(a, c) {
    a.ventLeger(c, 0.07);
    a.boucle(c, 700, 1400, () => {
      const t = a.contexte.currentTime + 0.02;
      const f = 4200 + Math.random() * 500;
      for (let i = 0; i < 3; i++) a.note(c, t + i * 0.07, f, f * 1.02, 0.035, 0.035);
    });
  },
  oiseaux(a, c) {
    a.ventLeger(c, 0.08);
    a.boucle(c, 1200, 3600, () => {
      const t = a.contexte.currentTime + 0.02;
      const f0 = 2100 + Math.random() * 1400;
      const nb = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < nb; i++) {
        const f = f0 * (0.9 + Math.random() * 0.25);
        a.note(c, t + i * 0.14, f, f * (1.15 + Math.random() * 0.25), 0.09, 0.045);
      }
    });
  },
};

export const SON_DE_SCENE: Record<string, SonAmbiance> = {
  aube: "oiseaux",
  mer: "vagues",
  desert: "vent",
  nuit: "grillons",
  foret: "pluie",
  montagnes: "ruisseau",
};
