"use client";

/* Guide pas à pas générique : intro + mérites, frise de progression,
   une étape à la fois (illustration, points, invocations, outil), écran final.
   La progression est gardée dans localStorage (clé coran-guide-<id>). */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dhikr, Guide } from "@/data/guides";
import { usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";
import Illustration from "@/components/IllustrationsGuides";
import { CompteurSay, CompteurTawaf, DernierTiers } from "@/components/OutilsGuides";
import { Alerte, Ampoule, Citation } from "@/components/Icones";

interface Progression {
  etape: number;
  faites: number[];
  fini: boolean;
}

function lireProgression(id: string, total: number): Progression | null {
  try {
    const p = JSON.parse(localStorage.getItem(`coran-guide-${id}`) ?? "null");
    if (p && Number.isInteger(p.etape) && p.etape >= 0 && p.etape < total && Array.isArray(p.faites))
      return { etape: p.etape, faites: p.faites.filter((n: unknown) => typeof n === "number"), fini: !!p.fini };
  } catch {}
  return null;
}

function BlocDhikr({ d }: { d: Dhikr }) {
  const { prefs } = usePrefs();
  return (
    <div className="mt-4 rounded-2xl p-4" style={{ border: "1px solid var(--border)" }}>
      {d.titre && (
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
          {d.titre}
        </p>
      )}
      <p className={`arabic text-2xl leading-loose ${prefs.police}`} dir="rtl">
        {d.arabe}
      </p>
      <p className="mt-3 text-sm italic" style={{ color: "var(--accent)" }}>
        {d.translit}
      </p>
      <p className="mt-2 text-sm">{d.fr}</p>
      <p className="mt-2 text-xs font-bold" style={{ color: "var(--muted)" }}>
        — {d.source}
      </p>
    </div>
  );
}

export default function GuidePasAPas({
  guide,
  retour,
  icone,
}: {
  guide: Guide;
  retour: { href: string; libelle: string };
  icone: React.ReactNode;
}) {
  const total = guide.etapes.length;
  const [etape, setEtape] = useState(0);
  const [faites, setFaites] = useState<Set<number>>(new Set());
  const [fini, setFini] = useState(false);
  const carteRef = useRef<HTMLDivElement>(null);
  const charge = useRef(false);
  const aNavigue = useRef(false);

  useEffect(() => {
    const p = lireProgression(guide.id, total);
    if (p) {
      setEtape(p.etape);
      setFaites(new Set(p.faites));
      setFini(p.fini);
    }
    charge.current = true;
  }, [guide.id, total]);

  useEffect(() => {
    if (!charge.current) return;
    try {
      localStorage.setItem(
        `coran-guide-${guide.id}`,
        JSON.stringify({ etape, faites: Array.from(faites), fini })
      );
    } catch {}
    if (aNavigue.current) {
      carteRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [etape, faites, fini, guide.id]);

  const aller = (i: number) => {
    aNavigue.current = true;
    setFini(false);
    setEtape(Math.max(0, Math.min(total - 1, i)));
  };

  const valider = () => {
    aNavigue.current = true;
    setFaites((f) => new Set(f).add(etape));
    try {
      navigator.vibrate?.(25);
    } catch {}
    if (etape === total - 1) setFini(true);
    else setEtape(etape + 1);
  };

  const recommencer = () => {
    aNavigue.current = true;
    setFaites(new Set());
    setFini(false);
    setEtape(0);
  };

  const e = guide.etapes[etape];
  const pourcent = Math.round((faites.size / total) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      <section className="mt-6 flex items-center justify-between gap-3">
        <Link
          href={retour.href}
          className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
        >
          ← {retour.libelle}
        </Link>
        <h2 className="flex items-center gap-2 text-right text-xl font-extrabold">
          <span style={{ color: "var(--accent)" }}>{icone}</span> {guide.titre}
        </h2>
      </section>

      {/* Intro */}
      <div className="card mt-5 rounded-3xl p-5 shadow-soft">
        <p className="text-sm font-extrabold" style={{ color: "var(--accent)" }}>
          {guide.sousTitre}
        </p>
        <p className="mt-2 text-sm leading-relaxed">{guide.intro}</p>
        <div className="mt-3 space-y-2">
          {guide.merites.map((m, i) => (
            <p key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
                <Citation taille={14} />
              </span>
              <span>
                « {m.texte} »{" "}
                <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                  — {m.source}
                </span>
              </span>
            </p>
          ))}
        </div>
      </div>

      {/* Frise de progression */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold" style={{ color: "var(--muted)" }}>
          <span>
            {faites.size}/{total} étapes faites
          </span>
          <span>{pourcent} %</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${pourcent}%`, background: "var(--accent)", transition: "width .4s" }}
          />
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {guide.etapes.map((et, i) => {
            const faite = faites.has(i);
            const active = i === etape && !fini;
            return (
              <button
                key={i}
                onClick={() => aller(i)}
                title={et.titre}
                aria-label={`Étape ${i + 1} : ${et.titre}`}
                aria-current={active ? "step" : undefined}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold transition active:scale-90"
                style={{
                  background: faite ? "var(--accent)" : "var(--card)",
                  color: faite ? "#fff" : "var(--text)",
                  border: `2px solid ${active ? "var(--accent)" : faite ? "var(--accent)" : "var(--border)"}`,
                  transform: active ? "scale(1.15)" : undefined,
                }}
              >
                {faite ? "✓" : i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Étape courante ou écran final */}
      <div ref={carteRef} className="scroll-mt-20">
        {fini ? (
          <div key="fin" className="card pop mt-5 rounded-3xl p-6 text-center shadow-soft">
            <div className="mx-auto h-32 w-32">
              <Illustration nom="fin" />
            </div>
            <h3 className="mt-4 text-2xl font-extrabold">{guide.fin.titre}</h3>
            <p className="mt-2 text-sm">{guide.fin.texte}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => aller(0)}
                className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition active:scale-95"
              >
                Revoir les étapes
              </button>
              <button
                onClick={recommencer}
                className="rounded-full px-4 py-2 text-sm font-bold text-white shadow-soft transition active:scale-95"
                style={{ background: "var(--accent)" }}
              >
                Tout recommencer
              </button>
            </div>
          </div>
        ) : (
          <div key={etape} className="card pop mt-5 rounded-3xl p-5 shadow-soft sm:p-6">
            <div className="flex items-center gap-4">
              <div
                className="h-24 w-24 shrink-0 rounded-3xl p-2 sm:h-28 sm:w-28"
                style={{
                  background:
                    "linear-gradient(145deg, color-mix(in srgb, var(--accent) 14%, transparent), transparent)",
                }}
              >
                <Illustration nom={e.illustration} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
                  Étape {etape + 1} / {total}
                </p>
                <h3 className="mt-1 text-xl font-extrabold leading-tight">{e.titre}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {e.resume}
                </p>
              </div>
            </div>

            <ol className="mt-5 space-y-3">
              {e.points.map((p, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
                    style={{ border: "1.5px solid var(--accent)", color: "var(--accent)" }}
                  >
                    {i + 1}
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>

            {e.cas && (
              <div className="mt-5 space-y-3">
                {e.cas.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-4"
                    style={{ border: `${c.recommande ? 2 : 1}px solid ${c.recommande ? "var(--accent)" : "var(--border)"}` }}
                  >
                    <p className="flex flex-wrap items-center gap-2 font-extrabold">
                      <span style={{ color: "var(--accent)" }}>Si…</span> {c.titre}
                      {c.recommande && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[11px] font-extrabold text-white"
                          style={{ background: "var(--accent)" }}
                        >
                          Le meilleur
                        </span>
                      )}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {c.frise.map((f, j) => (
                        <span key={j} className="flex items-center gap-1.5">
                          {j > 0 && (
                            <span className="text-xs" style={{ color: "var(--accent)" }}>
                              →
                            </span>
                          )}
                          <span
                            className="rounded-full px-2.5 py-1 text-xs font-bold"
                            style={{
                              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                              border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                            }}
                          >
                            {f}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2">
                      {c.texte.map((t, j) => (
                        <p key={j} className="text-sm leading-relaxed">
                          {t}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {e.outil === "tawaf" && <CompteurTawaf />}
            {e.outil === "say" && <CompteurSay />}
            {e.outil === "dernier-tiers" && <DernierTiers />}

            {e.dhikrs?.map((d, i) => <BlocDhikr key={i} d={d} />)}

            {e.astuce && (
              <p
                className="mt-4 flex items-start gap-2 rounded-2xl p-3 text-sm"
                style={{ border: "1.5px solid var(--accent)" }}
              >
                <span className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
                  <Ampoule taille={16} />
                </span>
                {e.astuce}
              </p>
            )}

            {e.lien && (
              <Link
                href={e.lien.href}
                className="mt-4 inline-block text-sm font-bold underline"
                style={{ color: "var(--accent)" }}
              >
                {e.lien.libelle} →
              </Link>
            )}

            <div className="mt-6 flex items-center justify-between gap-2">
              <button
                onClick={() => aller(etape - 1)}
                disabled={etape === 0}
                className="card whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 disabled:opacity-40"
              >
                ← Précédent
              </button>
              <button
                onClick={valider}
                className="whitespace-nowrap rounded-full px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:scale-105 active:scale-95"
                style={{ background: "var(--accent)" }}
              >
                {etape === total - 1 ? "Terminer ✓" : "C'est fait ✓ Suivant"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* À éviter */}
      <details className="card mt-6 overflow-hidden rounded-2xl shadow-soft">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
          <span style={{ color: "var(--accent)" }}>
            <Alerte taille={20} />
          </span>
          <span className="min-w-0 flex-1 font-bold">Erreurs fréquentes à éviter</span>
          <span className="shrink-0 text-sm" style={{ color: "var(--muted)" }}>
            ▾
          </span>
        </summary>
        <ul className="space-y-2 border-t px-4 pb-4 pt-3" style={{ borderColor: "var(--border)" }}>
          {guide.aEviter.map((a, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="shrink-0 font-extrabold" style={{ color: "var(--accent)" }}>
                ✕
              </span>
              {a}
            </li>
          ))}
        </ul>
      </details>

      <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
        Contenu basé sur les hadiths authentiques. Pour un cas particulier, demande
        conseil à un savant de confiance.
      </p>
    </div>
  );
}
