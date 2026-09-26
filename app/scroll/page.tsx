"use client";

/* Scroll halal : un fil vertical façon TikTok, par séries de 10 rappels
   (Coran récité, hadiths, invocations) sur des paysages animés.
   Après chaque série, une carte « pause » invite à lire le Coran. */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  sceneDe,
  tirerSerie,
  trouverCarte,
  type Carte,
  type Filtre,
} from "@/data/fil";
import { Ambiance, SON_DE_SCENE } from "@/lib/ambiance";
import { lireMarquePage } from "@/lib/marquePage";
import SceneNature from "@/components/ScenesNature";
import { CarteCoran, CarteTexte } from "@/components/CartesFil";
import {
  Coeur,
  CoeurPlein,
  HautParleur,
  LivreOuvert,
  Muet,
  Partager,
  Pause,
} from "@/components/Icones";

type Element = Carte | { type: "pause"; id: string; serie: number };

const FILTRES: { id: Filtre; nom: string }[] = [
  { id: "tout", nom: "Tout" },
  { id: "coran", nom: "Coran" },
  { id: "hadith", nom: "Hadiths" },
  { id: "invocation", nom: "Invocations" },
  { id: "favoris", nom: "Favoris" },
];

const CLE_FAVORIS = "coran-fil-favoris";
const SILENCE =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";

function lireFavoris(): Set<string> {
  try {
    const t = JSON.parse(localStorage.getItem(CLE_FAVORIS) ?? "[]");
    if (Array.isArray(t)) return new Set(t.filter((x) => typeof x === "string"));
  } catch {}
  return new Set();
}

function lienDe(c: Carte): { href: string; libelle: string } | null {
  if (c.type === "coran") return { href: `/sourate/${c.s}#v-${c.de}`, libelle: "Lire la sourate" };
  if (c.type === "invocation") return { href: "/invocations", libelle: "Toutes les invocations" };
  return null;
}

export default function ScrollHalal() {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [elements, setElements] = useState<Element[]>([]);
  const [actif, setActif] = useState(0);
  const [demarre, setDemarre] = useState(false);
  const [muet, setMuet] = useState(false);
  const [enPause, setEnPause] = useState(false);
  const [favoris, setFavoris] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const conteneurRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambianceRef = useRef<Ambiance | null>(null);
  const vuesRef = useRef<Set<string>>(new Set());
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [marque, setMarque] = useState<ReturnType<typeof lireMarquePage>>(null);

  /* Construit une nouvelle série et l'ajoute (ou remplace le fil). */
  const ajouterSerie = useCallback(
    (f: Filtre, remplacer: boolean, favs: Set<string>, premier?: Carte) => {
      let serie = tirerSerie(f, favs, vuesRef.current);
      if (premier) serie = [premier, ...serie.filter((c) => c.id !== premier.id)].slice(0, 10);
      serie.forEach((c) => vuesRef.current.add(c.id));
      setElements((ancien) => {
        const base = remplacer ? [] : ancien;
        const num = base.filter((e) => e.type === "pause").length + 1;
        const suite: Element[] = serie.length
          ? [...serie, { type: "pause", id: `pause-${num}-${Date.now()}`, serie: num }]
          : [];
        return [...base, ...suite];
      });
    },
    []
  );

  // Au chargement : favoris + carte partagée éventuelle (?c=…)
  useEffect(() => {
    setMarque(lireMarquePage());
    const favs = lireFavoris();
    setFavoris(favs);
    const m = window.location.search.match(/[?&]c=([\w-]+)/);
    const partagee = m ? trouverCarte(m[1]) : undefined;
    ajouterSerie("tout", true, favs, partagee);
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    setAudio(a);
    ambianceRef.current = new Ambiance();
    return () => {
      a.pause();
      ambianceRef.current?.arreter();
    };
  }, [ajouterSerie]);

  // Carte visible = celle qui occupe l'écran
  useEffect(() => {
    const racine = conteneurRef.current;
    if (!racine) return;
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setActif(Number((e.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: racine, threshold: [0.6] }
    );
    racine.querySelectorAll("[data-index]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [elements]);

  const courant = elements[actif];

  // Son d'ambiance sous les textes (jamais pendant une récitation)
  useEffect(() => {
    const amb = ambianceRef.current;
    if (!amb) return;
    if (!demarre || muet || enPause || !courant || courant.type === "coran") {
      amb.arreter();
      return;
    }
    amb.jouer(SON_DE_SCENE[courant.type === "pause" ? "aube" : sceneDe(courant.id)]);
  }, [demarre, muet, enPause, courant]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muet;
  }, [muet]);

  // Reprendre la lecture quand on change de carte
  useEffect(() => {
    setEnPause(false);
  }, [actif]);

  const commencer = () => {
    const a = audioRef.current;
    if (a) {
      // Débloque la lecture audio (obligatoire sur iPhone)
      a.src = SILENCE;
      a.play().catch(() => {});
    }
    ambianceRef.current?.deverrouiller();
    setDemarre(true);
  };

  const changerFiltre = (f: Filtre) => {
    if (f === filtre) return;
    setFiltre(f);
    vuesRef.current = new Set();
    ajouterSerie(f, true, favoris);
    setActif(0);
    conteneurRef.current?.scrollTo({ top: 0 });
  };

  const basculerFavori = (id: string) => {
    setFavoris((f) => {
      const n = new Set(f);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      try {
        localStorage.setItem(CLE_FAVORIS, JSON.stringify(Array.from(n)));
      } catch {}
      return n;
    });
  };

  const afficher = (t: string) => {
    setMessage(t);
    window.setTimeout(() => setMessage(""), 2200);
  };

  const partager = async (c: Carte) => {
    const url = `${window.location.origin}/scroll?c=${c.id}`;
    const texte =
      c.type === "hadith" ? `« ${c.texte} » — ${c.source}` : c.type === "invocation" ? `${c.titre} : ${c.fr}` : c.theme;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Easy Muslim", text: texte, url });
        return;
      }
      await navigator.clipboard.writeText(`${texte}\n${url}`);
      afficher("Lien copié");
    } catch {}
  };


  return (
    <div className="fixed inset-0 z-40" style={{ background: "var(--bg)" }}>
      <div className="relative mx-auto h-full max-w-[480px]">
        {/* Barre du haut */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start gap-2 p-3">
          <Link
            href="/"
            aria-label="Retour à l'accueil"
            className="verre pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-soft"
          >
            ←
          </Link>
          <div className="pointer-events-auto flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {FILTRES.map((f) => (
              <button
                key={f.id}
                onClick={() => changerFiltre(f.id)}
                className={`${filtre === f.id ? "" : "verre"} shrink-0 rounded-full px-3 py-2 text-xs font-extrabold shadow-soft transition active:scale-95`}
                style={
                  filtre === f.id
                    ? { background: "var(--accent-fort)", color: "var(--sur-accent)" }
                    : undefined
                }
              >
                {f.nom}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMuet((m) => !m)}
            aria-label={muet ? "Activer le son" : "Couper le son"}
            className="verre pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-soft"
            style={{ color: "var(--accent-fort)" }}
          >
            {muet ? <Muet taille={18} /> : <HautParleur taille={18} />}
          </button>
        </div>

        {/* Le fil */}
        <div ref={conteneurRef} className="fil-conteneur">
          {elements.length === 0 && (
            <section className="fil-carte relative flex items-center justify-center overflow-hidden px-5">
              <SceneNature scene="montagnes" anime />
              <div className="verre relative z-10 rounded-3xl p-6 text-center shadow-soft">
                <p className="font-extrabold">Aucun favori pour l'instant</p>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  Touche le cœur sur un rappel pour le retrouver ici.
                </p>
                <button
                  onClick={() => changerFiltre("tout")}
                  className="mt-4 rounded-full px-5 py-2 text-sm font-bold shadow-soft"
                  style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
                >
                  Voir tous les rappels
                </button>
              </div>
            </section>
          )}

          {elements.map((el, i) => {
            const anime = Math.abs(i - actif) <= 1;
            if (el.type === "pause") {
              return (
                <section key={el.id} data-index={i} className="fil-carte relative flex items-center overflow-hidden px-5">
                  <SceneNature scene="aube" anime={anime} />
                  <div className="verre relative z-10 w-full rounded-3xl p-6 text-center shadow-soft">
                    <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
                      Petite pause
                    </p>
                    <p className="mt-2 text-2xl font-extrabold" style={{ fontFamily: "Marcellus, serif" }}>
                      Tu as reçu {el.serie * 10} rappels
                    </p>
                    <p className="mt-3 text-sm leading-relaxed">
                      « L'œuvre la plus aimée d'Allah est la plus régulière, même si elle est peu. »
                      <span className="block text-xs font-bold" style={{ color: "var(--muted)" }}>
                        — Al-Bukhari & Muslim
                      </span>
                    </p>
                    <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                      Et si tu lisais maintenant une page du Coran ?
                    </p>
                    <div className="mt-5 flex flex-col gap-2">
                      <Link
                        href={marque ? `/sourate/${marque.s}#v-${marque.v}` : "/coran"}
                        className="flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold shadow-soft"
                        style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
                      >
                        <LivreOuvert taille={18} /> {marque ? "Reprendre ma lecture" : "Lire le Coran"}
                      </Link>
                      {i === elements.length - 1 && (
                        <button
                          onClick={() => ajouterSerie(filtre, false, favoris)}
                          className="card rounded-full px-5 py-3 text-sm font-bold shadow-soft"
                        >
                          Encore 10 rappels
                        </button>
                      )}
                    </div>
                  </div>
                </section>
              );
            }

            const fav = favoris.has(el.id);
            const lien = lienDe(el);
            return (
              <section
                key={`${el.id}-${i}`}
                data-index={i}
                className="fil-carte relative flex items-center overflow-hidden px-4 pb-24 pt-16"
                onClick={() => demarre && setEnPause((p) => !p)}
              >
                <SceneNature scene={sceneDe(el.id)} anime={anime && !enPause} />
                <div className="relative z-10 max-h-full w-full overflow-y-auto pr-12">
                  {el.type === "coran" ? (
                    <CarteCoran
                      carte={el}
                      proche={Math.abs(i - actif) <= 2}
                      actif={i === actif}
                      lecture={demarre && !enPause}
                      audio={audio}
                    />
                  ) : (
                    <CarteTexte carte={el} />
                  )}
                </div>

                {/* Actions façon TikTok */}
                <div
                  className="absolute bottom-24 right-3 z-20 flex flex-col items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => basculerFavori(el.id)}
                    aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className="verre flex h-11 w-11 items-center justify-center rounded-full shadow-soft transition active:scale-90"
                    style={{ color: fav ? "#d9435a" : "var(--text)" }}
                  >
                    {fav ? <CoeurPlein taille={20} /> : <Coeur taille={20} />}
                  </button>
                  <button
                    onClick={() => partager(el)}
                    aria-label="Partager"
                    className="verre flex h-11 w-11 items-center justify-center rounded-full shadow-soft transition active:scale-90"
                  >
                    <Partager taille={19} />
                  </button>
                  {lien && (
                    <Link
                      href={lien.href}
                      aria-label={lien.libelle}
                      title={lien.libelle}
                      className="verre flex h-11 w-11 items-center justify-center rounded-full shadow-soft transition active:scale-90"
                      style={{ color: "var(--accent-fort)" }}
                    >
                      <LivreOuvert taille={19} />
                    </Link>
                  )}
                </div>

                {enPause && i === actif && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <span className="verre flex h-16 w-16 items-center justify-center rounded-full shadow-soft" style={{ color: "var(--accent-fort)" }}>
                      <Pause taille={28} />
                    </span>
                  </div>
                )}

                {i === 0 && demarre && actif === 0 && (
                  <p
                    className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center text-xs font-bold"
                    style={{ color: "var(--text)", textShadow: "0 1px 6px var(--card)" }}
                  >
                    Fais glisser vers le haut ↑
                  </p>
                )}
              </section>
            );
          })}
        </div>

        {/* Écran de démarrage : débloque le son */}
        {!demarre && elements.length > 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6" style={{ background: "color-mix(in srgb, var(--bg) 35%, transparent)" }}>
            <div className="verre pop w-full rounded-3xl p-6 text-center shadow-soft">
              <h1 className="text-2xl font-extrabold">Scroll halal</h1>
              <p className="mt-2 text-sm leading-relaxed">
                Des extraits du Coran récités, des hadiths et des invocations, sur des paysages
                apaisants. <b>10 rappels</b> à la fois, puis une petite pause.
              </p>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                Touche l'écran pour mettre en pause, le cœur pour garder un rappel en favori.
              </p>
              <button
                onClick={commencer}
                className="mt-5 w-full rounded-full px-6 py-3 font-extrabold shadow-soft transition active:scale-95"
                style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
              >
                Commencer ▶
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="verre pop absolute bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full px-4 py-2 text-sm font-bold shadow-soft">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
