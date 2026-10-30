"use client";

/* Accueil : une carte « Aujourd'hui » (date, prochaine prière), deux gros
   boutons d'action, puis les rubriques rangées par usage avec des tuiles
   colorées faciles à reconnaître. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { hadithDuJour, type Hadith } from "@/data/hadiths";
import { SOURATES } from "@/data/sourates";
import { libelleHijri, versHijri } from "@/lib/hijri";
import { depuis, lireMarquePage, type MarquePage } from "@/lib/marquePage";
import {
  chargerHoraires,
  lireConfigPriere,
  prochainePriere,
  type HorairesJour,
} from "@/lib/prieres";
import Entete from "@/components/Entete";
import GuideInstallation from "@/components/GuideInstallation";
import Illustration from "@/components/IllustrationsGuides";
import {
  Boussole,
  Bouclier,
  Calendrier as IconeCalendrier,
  Citation,
  Cloche,
  Coeur,
  Defiler,
  Horloge,
  KaabaIcone,
  Lettres,
  LivreOuvert,
  LuneEtoile,
  Micro,
  Pinceau,
  Repeter,
} from "@/components/Icones";

type Icone = (p: { taille?: number; className?: string }) => JSX.Element;

interface Tuile {
  href: string;
  icone: Icone;
  /** Illustration 3D (public/icones/*.webp) — remplace l'icône dessinée. */
  image?: string;
  nom: string;
  sous: string;
  teinte: string; // couleur propre à la rubrique
}

/** Photo Pexels recadrée en carré (licence Pexels : usage libre, hotlink autorisé).
 *  En attendant les illustrations 3D : voir public/icones/. */
const pexels = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop`;

const LIRE: Tuile[] = [
  { href: "/coran", icone: LivreOuvert, image: "/icones/coran.webp", nom: "Coran", sous: "Lire et écouter, tajwid en couleur", teinte: "#2e7d5b" },
  { href: "/apprentissage", icone: Repeter, image: "/icones/memoriser.webp", nom: "Mémoriser", sous: "Répéter verset par verset", teinte: "#3b6ea5" },
  { href: "/nourania", icone: Lettres, image: "/icones/nourania.webp", nom: "Apprendre à lire", sous: "L'arabe pas à pas (Nourania)", teinte: "#7c5cad" },
  { href: "/recitation", icone: Micro, nom: "Récitation", sous: "Récite de mémoire, l'IA te corrige", teinte: "#2a7f8f" },
];

const QUOTIDIEN: Tuile[] = [
  { href: "/prieres", icone: Horloge, image: "/icones/prieres.webp", nom: "Prières", sous: "Horaires de ta ville", teinte: "#a07b26" },
  { href: "/invocations", icone: Coeur, image: "/icones/invocations.webp", nom: "Invocations", sous: "100 douas authentiques", teinte: "#b04a6f" },
  { href: "/rappels", icone: Cloche, image: pexels(20069741), nom: "Rappels", sous: "Notifications de prière", teinte: "#c0603f" },
  { href: "/calendrier", icone: IconeCalendrier, image: pexels(25181345), nom: "Calendrier", sous: "Dates importantes", teinte: "#4b55a8" },
];

const GUIDES = [
  { href: "/omra", nom: "La Omra", icone: KaabaIcone, dessin: "tawaf", image: pexels(38789865) },
  { href: "/invocations/nuit", nom: "Prière de la nuit", icone: LuneEtoile, dessin: "lune", image: pexels(39567592) },
  { href: "/invocations/istikhara", nom: "Istikhâra", icone: Boussole, dessin: "carrefour", image: pexels(6593988) },
  { href: "/invocations/tawba", nom: "Le repentir", icone: Repeter, dessin: "porte", image: pexels(31907685) },
  { href: "/invocations/roqya", nom: "La roqya", icone: Bouclier, dessin: "bouclier", image: pexels(36516084) },
];

const NOMS_PRIERES: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

/** Photo de fond selon le moment de la journée. */
function fondDuMoment(h: number) {
  if (h >= 4 && h < 9) return "/fonds/aube-2.jpg";
  if (h >= 9 && h < 16) return "/fonds/montagnes-2.jpg";
  if (h >= 16 && h < 19) return "/fonds/desert-2.jpg";
  return "/fonds/nuit-2.jpg";
}

function dansCombien(hhmm: string, maintenant: Date, demain = false) {
  const [h, m] = hhmm.split(":").map(Number);
  let min = h * 60 + m - (maintenant.getHours() * 60 + maintenant.getMinutes());
  if (demain || min < 0) min += 1440;
  if (min < 60) return `dans ${min} min`;
  return `dans ${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
}

/** Illustration 3D posée sur une plaque blanche arrondie (lisible en mode sombre aussi). */
function Vignette({ src, taille = 64 }: { src: string; taille?: number }) {
  return (
    <span
      className="block shrink-0 overflow-hidden rounded-2xl"
      style={{
        width: taille,
        height: taille,
        background: "#fff",
        boxShadow: "0 6px 16px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={taille} height={taille} className="h-full w-full object-cover" draggable={false} />
    </span>
  );
}

function TuileRubrique({ t }: { t: Tuile }) {
  return (
    <Link
      href={t.href}
      className="card group flex min-h-[8.5rem] flex-col justify-between rounded-3xl p-4 shadow-soft transition hover:-translate-y-0.5 active:scale-[0.97]"
      style={{
        background: `linear-gradient(160deg, color-mix(in srgb, ${t.teinte} 13%, var(--card)), var(--card) 70%)`,
        borderColor: `color-mix(in srgb, ${t.teinte} 28%, var(--border))`,
      }}
    >
      {t.image ? (
        <Vignette src={t.image} />
      ) : (
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{
            background: `color-mix(in srgb, ${t.teinte} 18%, var(--card))`,
            color: `color-mix(in srgb, ${t.teinte} 85%, var(--text))`,
          }}
        >
          <t.icone taille={26} />
        </span>
      )}
      <span className="mt-3 block">
        <span className="block text-base font-extrabold leading-tight">{t.nom}</span>
        <span className="mt-0.5 block text-xs leading-snug" style={{ color: "var(--muted)" }}>
          {t.sous}
        </span>
      </span>
    </Link>
  );
}

const ROMAINS = ["I", "II", "III", "IV", "V", "VI", "VII"];
function TitreSection({ children, numero }: { children: React.ReactNode; numero: number }) {
  return (
    <div className="titre-edito px-1">
      <small>{ROMAINS[numero - 1] ?? numero}</small>
      <h3>{children}</h3>
    </div>
  );
}


export default function Accueil() {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [hijri, setHijri] = useState("");
  const [dateFr, setDateFr] = useState("");
  const [fond, setFond] = useState("/fonds/montagnes-2.jpg");
  const [marque, setMarque] = useState<MarquePage | null>(null);
  const [ville, setVille] = useState<string | null>(null);
  const [horaires, setHoraires] = useState<HorairesJour | null>(null);
  const [maintenant, setMaintenant] = useState<Date | null>(null);

  useEffect(() => {
    const d = new Date();
    setHadith(hadithDuJour());
    setHijri(libelleHijri(versHijri(d)));
    setDateFr(d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
    setFond(fondDuMoment(d.getHours()));
    setMarque(lireMarquePage());
    setMaintenant(d);
    const config = lireConfigPriere();
    setVille(config?.ville ?? "");
    if (config) chargerHoraires(config).then(setHoraires).catch(() => {});
    const tic = window.setInterval(() => setMaintenant(new Date()), 30_000);
    return () => clearInterval(tic);
  }, []);

  const sourateMarquee = marque ? SOURATES.find((s) => s.n === marque.s) : null;

  // Prochaine prière (ou Fajr de demain si toutes sont passées)
  let prochaine: { nom: string; heure: string; dans: string } | null = null;
  if (horaires && maintenant) {
    const id = prochainePriere(horaires, maintenant);
    const cle = (id ?? "fajr") as keyof HorairesJour;
    prochaine = {
      nom: NOMS_PRIERES[cle] ?? "Fajr",
      heure: horaires[cle],
      dans: dansCombien(horaires[cle], maintenant, id === null),
    };
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      {/* ===== Aujourd'hui ===== */}
      <section
        className="relative mt-5 overflow-hidden rounded-[2rem] shadow-soft"
        style={{ minHeight: "15rem" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fond} alt="" className="accueil-fond absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.45))" }}
        />
        <div className="relative flex min-h-[15rem] flex-col justify-between p-4">
          <div className="verre self-start rounded-2xl px-3 py-2">
            <p className="text-sm font-extrabold first-letter:uppercase">{dateFr}</p>
            {hijri && (
              <p className="text-xs font-bold" style={{ color: "var(--accent-fort)" }}>
                {hijri} H
              </p>
            )}
          </div>

          <div className="verre mt-6 rounded-3xl p-4">
            <p className="arabic font-amiri text-center text-2xl" style={{ color: "var(--accent-fort)" }}>
              ﷽
            </p>
            <p className="text-center text-xl font-extrabold" style={{ fontFamily: "Marcellus, serif" }}>
              Assalâmu 'alaykum
            </p>
            <Link
              href="/prieres"
              className="mt-3 flex items-center gap-3 rounded-2xl px-3 py-2.5 transition active:scale-[0.98]"
              style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
            >
              <span style={{ color: "var(--accent-fort)" }}>
                <Horloge taille={22} />
              </span>
              {prochaine ? (
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold" style={{ color: "var(--muted)" }}>
                    Prochaine prière{ville ? ` · ${ville}` : ""}
                  </span>
                  <span className="block text-base font-extrabold">
                    {prochaine.nom} à {prochaine.heure}{" "}
                    <span className="text-sm font-bold" style={{ color: "var(--accent-fort)" }}>
                      · {prochaine.dans}
                    </span>
                  </span>
                </span>
              ) : (
                <span className="min-w-0 flex-1 text-sm font-bold">
                  {ville === "" ? "Choisis ta ville pour voir les horaires de prière" : "Horaires de prière"}
                </span>
              )}
              <span className="font-bold" style={{ color: "var(--accent-fort)" }}>
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Les deux actions principales ===== */}
      <section className="cascade mt-4 grid grid-cols-2 gap-3">
        <Link
          href={marque && sourateMarquee ? `/sourate/${marque.s}#v-${marque.v}` : "/coran"}
          className="flex flex-col justify-between rounded-3xl p-4 shadow-soft transition hover:-translate-y-0.5 active:scale-[0.97]"
          style={{ background: "var(--accent-fort)", color: "var(--sur-accent)", minHeight: "8rem" }}
        >
          <Vignette src={pexels(8522577)} taille={56} />
          <span className="mt-3 block">
            <span className="block text-base font-extrabold leading-tight">
              {sourateMarquee ? "Reprendre ma lecture" : "Lire le Coran"}
            </span>
            <span className="mt-0.5 block text-xs opacity-90">
              {sourateMarquee && marque
                ? `${sourateMarquee.nom}, verset ${marque.v}${marque.t ? ` · ${depuis(marque.t)}` : ""}`
                : "Commencer par Al-Fâtiha"}
            </span>
          </span>
        </Link>
        <Link
          href="/scroll"
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl p-4 shadow-soft transition hover:-translate-y-0.5 active:scale-[0.97]"
          style={{ minHeight: "8rem", color: "#fff" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fonds/mer-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.55))" }} />
          <span className="relative">
            <Defiler taille={26} />
          </span>
          <span className="relative mt-3 block">
            <span className="block text-base font-extrabold leading-tight">Scroll halal</span>
            <span className="mt-0.5 block text-xs opacity-90">10 rappels en vidéo</span>
          </span>
        </Link>
      </section>

      {/* ===== Assistant IA (mis en avant) ===== */}
      <Link
        href="/ia"
        className="relative mt-3 flex items-center gap-4 overflow-hidden rounded-3xl p-4 shadow-soft transition hover:-translate-y-0.5 active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, var(--accent-fort), color-mix(in srgb, var(--accent-fort) 70%, #1f3a5f))",
          color: "var(--sur-accent)",
        }}
      >
        <Vignette src={pexels(10695255)} taille={56} />
        <span className="min-w-0 flex-1">
          <span className="block text-base font-extrabold leading-tight">Pose ta question à l&apos;assistant</span>
          <span className="mt-0.5 block text-xs opacity-90">
            Réponses d&apos;après le Coran, la Sunna authentique et les savants · 3 questions offertes
          </span>
        </span>
        <span className="shrink-0 rounded-full px-3 py-1 text-xs font-extrabold" style={{ background: "rgba(255,255,255,0.18)" }}>
          Nouveau
        </span>
      </Link>

      {/* ===== Vendredi : Al-Kahf ===== */}
      {maintenant?.getDay() === 5 && (
        <Link
          href="/sourate/18?ecouter=1"
          className="card relief mt-3 flex items-center gap-4 rounded-3xl p-4 transition active:scale-[0.98]"
          style={{ borderColor: "var(--accent)" }}
        >
          <span className="chiffre-edito shrink-0" style={{ fontSize: "2.6rem", color: "var(--accent-fort)" }}>
            18
          </span>
          <span className="min-w-0 flex-1">
            <span className="hero-surtitre">C&apos;est vendredi</span>
            <span className="mt-1 block text-base font-extrabold leading-tight">Sourate Al-Kahf</span>
            <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
              « Une lumière l&apos;éclaire jusqu&apos;au vendredi suivant » — lire ou écouter
            </span>
          </span>
          <span className="pilule-pleine shrink-0 text-xs">▶ Écouter</span>
        </Link>
      )}

      {/* ===== Rappel du jour ===== */}
      {hadith && (
        <Link
          href="/scroll"
          className="card mt-3 block rounded-3xl p-4 shadow-soft transition active:scale-[0.99]"
        >
          <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
            <Citation taille={14} /> Hadith du jour
          </p>
          <p className="mt-2 leading-relaxed">« {hadith.texte} »</p>
          <p className="mt-2 text-xs font-bold" style={{ color: "var(--muted)" }}>
            — {hadith.source}
          </p>
        </Link>
      )}

      <GuideInstallation />

      {/* ===== Rubriques ===== */}
      <TitreSection numero={1}>Lire & apprendre</TitreSection>
      <div className="cascade grid grid-cols-2 gap-3 sm:grid-cols-4">
        {LIRE.map((t) => (
          <TuileRubrique key={t.href} t={t} />
        ))}
      </div>

      <TitreSection numero={2}>Au quotidien</TitreSection>
      <div className="cascade grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUOTIDIEN.map((t) => (
          <TuileRubrique key={t.href} t={t} />
        ))}
      </div>

      <TitreSection numero={3}>Guides pas à pas</TitreSection>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: "none" }}>
        {GUIDES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="card flex w-36 shrink-0 flex-col items-center rounded-3xl p-4 text-center shadow-soft transition active:scale-[0.97]"
          >
            {g.image ? (
              <Vignette src={g.image} taille={80} />
            ) : (
              <span
                className="h-20 w-20 rounded-2xl p-2"
                style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
              >
                <Illustration nom={g.dessin} />
              </span>
            )}
            <span className="mt-2 text-sm font-extrabold leading-tight">{g.nom}</span>
          </Link>
        ))}
      </div>

      <TitreSection numero={4}>Aller plus loin</TitreSection>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/soutien"
          className="card flex items-center gap-4 rounded-3xl p-4 shadow-soft transition active:scale-[0.98]"
          style={{
            background: "linear-gradient(160deg, color-mix(in srgb, #b04a6f 12%, var(--card)), var(--card) 70%)",
          }}
        >
          <Vignette src={pexels(5872362)} taille={56} />
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold">Soutenir l&apos;appli</span>
            <span className="block text-xs" style={{ color: "var(--muted)" }}>
              Gratuite et sans pub — un coup de pouce, montant libre
            </span>
          </span>
          <span className="font-bold" style={{ color: "var(--accent-fort)" }}>
            →
          </span>
        </Link>
      </div>

      <TitreSection numero={5}>Se détendre</TitreSection>
      <Link
        href="/jeux"
        className="card flex items-center gap-4 rounded-3xl p-4 shadow-soft transition active:scale-[0.98]"
        style={{
          background: "linear-gradient(160deg, color-mix(in srgb, #2e7d5b 12%, var(--card)), var(--card) 70%)",
        }}
      >
        <Vignette src={pexels(7296664)} taille={56} />
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold">Jeux</span>
          <span className="block text-xs" style={{ color: "var(--muted)" }}>
            Jeu Nourania et quiz de connaissances
          </span>
        </span>
        <span className="font-bold" style={{ color: "var(--accent-fort)" }}>
          →
        </span>
      </Link>

      <p
        className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs"
        style={{ color: "var(--muted)" }}
      >
        <Pinceau taille={14} /> Personnalise ton appli (thème, couleurs, récitateur) avec le pinceau en haut.
      </p>
      <p className="mt-3 text-center text-xs" style={{ color: "var(--muted)" }}>
        <Link href="/confidentialite" className="underline">
          Politique de confidentialité
        </Link>{" "}
        · Photos : Pexels
      </p>
    </div>
  );
}
