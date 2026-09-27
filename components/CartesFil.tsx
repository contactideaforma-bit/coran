"use client";

/* Contenu d'une carte du Scroll halal : extrait du Coran (récité verset par
   verset, texte synchronisé) ou texte (hadith, invocation). */

import { useEffect, useMemo, useState } from "react";
import type { Carte } from "@/data/fil";
import { nomSourate } from "@/data/fil";
import type { NomAllah } from "@/data/noms-allah";
import { chargerPhonetique, chargerSourate } from "@/lib/coran";
import { urlVerset } from "@/lib/audio";
import { usePrefs } from "@/lib/prefs";

interface VersetFil {
  n: number;
  arabe: string;
  fr: string;
  phon: string;
}

const tailleArabe = (t: string) =>
  t.length > 260 ? "text-xl" : t.length > 140 ? "text-2xl" : t.length > 60 ? "text-3xl" : "text-4xl";

/** Lecture enchaînée de versets avec l'audio partagé du fil, en boucle.
 *  Renvoie l'index du verset en cours (et un compteur de tours). */
function useLectureVersets(
  s: number,
  numeros: number[] | null,
  actif: boolean,
  lecture: boolean,
  audio: HTMLAudioElement | null,
  recitateur: string,
  dureeSecours: (i: number) => number
) {
  const [pos, setPos] = useState({ i: 0, tour: 0 });

  useEffect(() => {
    if (!actif) setPos({ i: 0, tour: 0 });
  }, [actif]);

  useEffect(() => {
    if (!audio || !actif || !lecture || !numeros?.length) return;
    let annule = false;
    let minuterie = 0;
    const dernier = pos.i === numeros.length - 1;
    const suivant = (delai: number) =>
      window.setTimeout(() => {
        if (annule) return;
        setPos((p) =>
          p.i < numeros.length - 1 ? { i: p.i + 1, tour: p.tour } : { i: 0, tour: p.tour + 1 }
        );
      }, delai);
    audio.onended = () => {
      minuterie = suivant(dernier ? 1800 : 250);
    };
    // Sans réseau : on laisse le temps de lire puis on passe au verset suivant
    audio.onerror = () => {
      minuterie = suivant(dureeSecours(pos.i));
    };
    audio.src = urlVerset(s, numeros[pos.i], recitateur);
    audio.play().catch(() => {});
    return () => {
      annule = true;
      clearTimeout(minuterie);
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, actif, lecture, numeros, pos, s, recitateur]);

  return pos;
}

export function CarteCoran({
  carte,
  proche,
  actif,
  lecture,
  audio,
}: {
  carte: Extract<Carte, { type: "coran" }>;
  proche: boolean; // charger les données à l'avance
  actif: boolean; // carte visible
  lecture: boolean; // démarré et pas en pause
  audio: HTMLAudioElement | null;
}) {
  const { prefs } = usePrefs();
  const [versets, setVersets] = useState<VersetFil[] | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    if (!proche || versets) return;
    let annule = false;
    Promise.all([chargerSourate(carte.s), chargerPhonetique(carte.s).catch(() => [] as string[])])
      .then(([d, phon]) => {
        if (annule) return;
        setVersets(
          d.verses
            .filter((v) => v.n >= carte.de && v.n <= carte.a)
            .map((v) => ({
              n: v.n,
              arabe: v.words.map((w) => w.segments.map((s) => s.t).join("")).join(" "),
              fr: v.traduction,
              phon: phon[v.n - 1] ?? "",
            }))
        );
      })
      .catch(() => !annule && setErreur(true));
    return () => {
      annule = true;
    };
  }, [proche, versets, carte.s, carte.de, carte.a]);

  const numeros = useMemo(() => versets?.map((x) => x.n) ?? null, [versets]);
  const pos = useLectureVersets(
    carte.s,
    numeros,
    actif,
    lecture,
    audio,
    prefs.recitateur,
    (i) => 4000 + (versets?.[i]?.arabe.length ?? 0) * 40
  );

  const v = versets?.[pos.i];

  return (
    <div className="verre w-full rounded-3xl p-5 shadow-soft">
      <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
        Coran · {nomSourate(carte.s)} {carte.s}:{carte.de}
        {carte.a > carte.de ? `-${carte.a}` : ""}
      </p>
      <p className="mt-0.5 text-sm font-bold">{carte.theme}</p>

      {erreur && (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          Texte indisponible hors connexion.
        </p>
      )}
      {!versets && !erreur && (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          Chargement…
        </p>
      )}
      {v && (
        <div key={`${v.n}-${pos.tour}`} className="pop mt-4">
          <p className={`arabic ${tailleArabe(v.arabe)} leading-loose ${prefs.police}`} dir="rtl">
            {v.arabe} <span className="text-base" style={{ color: "var(--accent-fort)" }}>﴿{v.n}﴾</span>
          </p>
          {v.phon && (
            <p className="mt-2 text-sm italic" style={{ color: "var(--accent-fort)" }}>
              {v.phon}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed">{v.fr}</p>
        </div>
      )}
      {versets && versets.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {versets.map((x, i) => (
            <span
              key={x.n}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === pos.i ? 18 : 6,
                background: i <= pos.i ? "var(--accent-fort)" : "var(--border)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CarteTexte({ carte }: { carte: Extract<Carte, { type: "hadith" | "invocation" }> }) {
  const { prefs } = usePrefs();
  if (carte.type === "hadith") {
    return (
      <div className="verre w-full rounded-3xl p-6 shadow-soft">
        <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
          Hadith
        </p>
        <p className="mt-3 text-xl leading-relaxed" style={{ fontFamily: "Marcellus, serif" }}>
          « {carte.texte} »
        </p>
        <p className="mt-4 text-sm font-bold" style={{ color: "var(--muted)" }}>
          — Rapporté par {carte.source}
        </p>
      </div>
    );
  }
  return (
    <div className="verre w-full rounded-3xl p-5 shadow-soft">
      <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
        Invocation
      </p>
      <p className="mt-0.5 text-sm font-bold">{carte.titre}</p>
      <p className={`arabic mt-4 ${tailleArabe(carte.arabe)} leading-loose ${prefs.police}`} dir="rtl">
        {carte.arabe}
      </p>
      <p className="mt-2 text-sm italic" style={{ color: "var(--accent-fort)" }}>
        {carte.translit}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{carte.fr}</p>
      <p className="mt-3 text-xs font-bold" style={{ color: "var(--muted)" }}>
        — {carte.source}
      </p>
    </div>
  );
}

/** Un des 99 noms : nom en arabe, phonétique, français, signification,
 *  puis un verset qui le contient (ou qui en exprime le sens), récité. */
export function CarteNom({
  nom,
  proche,
  actif,
  lecture,
  audio,
}: {
  nom: NomAllah;
  proche: boolean;
  actif: boolean;
  lecture: boolean;
  audio: HTMLAudioElement | null;
}) {
  const { prefs } = usePrefs();
  const { s, v, contient } = nom.verset;
  const [verset, setVerset] = useState<{ arabe: string; fr: string } | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    if (!proche || verset) return;
    let annule = false;
    chargerSourate(s)
      .then((d) => {
        const x = d.verses.find((y) => y.n === v);
        if (!annule && x)
          setVerset({
            arabe: x.words.map((w) => w.segments.map((g) => g.t).join("")).join(" "),
            fr: x.traduction,
          });
      })
      .catch(() => !annule && setErreur(true));
    return () => {
      annule = true;
    };
  }, [proche, verset, s, v]);

  const numeros = useMemo(() => (verset ? [v] : null), [verset, v]);
  useLectureVersets(s, numeros, actif, lecture, audio, prefs.recitateur, () => 8000);

  return (
    <div className="verre w-full rounded-3xl p-5 text-center shadow-soft">
      <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
        Nom d'Allah · {nom.n}/99
      </p>
      <p
        className={`arabic mt-3 ${nom.arabe.length > 14 ? "text-4xl" : "text-6xl"} leading-snug ${prefs.police}`}
        dir="rtl"
        style={{ color: "var(--accent-fort)" }}
      >
        {nom.arabe}
      </p>
      <p className="mt-1 text-base italic" style={{ color: "var(--accent-fort)" }}>
        {nom.translit}
      </p>
      <p className="mt-1 text-xl font-extrabold" style={{ fontFamily: "Marcellus, serif" }}>
        {nom.nomFr}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{nom.sens}</p>
      {nom.note && (
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          {nom.note}
        </p>
      )}

      <div className="mt-4 border-t pt-3 text-left" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-extrabold" style={{ color: "var(--muted)" }}>
          {contient ? "Dans le Coran" : "En lien dans le Coran"} · {nomSourate(s)} {s}:{v}
        </p>
        {verset ? (
          <>
            <p className={`arabic mt-2 ${verset.arabe.length > 200 ? "text-lg" : "text-xl"} leading-loose ${prefs.police}`} dir="rtl">
              {verset.arabe}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{verset.fr}</p>
          </>
        ) : (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {erreur ? "Verset indisponible hors connexion." : "Chargement du verset…"}
          </p>
        )}
      </div>
    </div>
  );
}
