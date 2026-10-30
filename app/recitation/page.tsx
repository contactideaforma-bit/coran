"use client";

/* Récitation — quiz vocal façon Tarteel.
 *
 * L'appli propose un verset (ou une plage), l'utilisateur le récite de
 * mémoire, l'audio est transcrit (OpenAI) et comparé mot à mot au texte du
 * Coran. Le coût est payé par l'utilisateur, à la seconde, sans commission
 * (voir lib/recitation-serveur.ts) ; trois essais sont offerts par appareil.
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SOURATES } from "@/data/sourates";
import { usePrefs } from "@/lib/prefs";
import type { Comparaison, ResultatHistorique } from "@/lib/recitation-serveur";
import Entete from "@/components/Entete";
import EnTeteRubrique from "@/components/EnTeteRubrique";
import ChoixSourate from "@/components/ChoixSourate";
import { Alerte, Cadenas, Coeur, Micro, Verifie } from "@/components/Icones";

interface Tarif {
  prixPack: number;
  frais: number;
  net: number;
  secondes: number;
  coutMinute: number;
  fraisPourcent: number;
  fraisFixe: number;
  dureeMax: number;
  lien: string;
}

interface Etat {
  connecte: boolean;
  email?: string;
  secondes?: number;
  historique?: ResultatHistorique[];
  essaisRestants?: number;
  essaisTotal?: number;
  tarif: Tarif;
}

interface Resultat extends Comparaison {
  attendu: string;
  transcription: string;
  secondes: number;
  reste: number | null;
  essaisRestants: number | null;
}

type Phase = "pret" | "enregistre" | "analyse" | "resultat";

const euros = (centimes: number) =>
  (centimes / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const dureeLisible = (s: number) => {
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}`;
};

export default function Recitation() {
  const { prefs } = usePrefs();
  const [etat, setEtat] = useState<Etat | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);

  // Défi
  const [sourate, setSourate] = useState(1);
  const [mode, setMode] = useState<"hasard" | "choix">("hasard");
  const [de, setDe] = useState(1);
  const [a, setA] = useState(1);
  const [indice, setIndice] = useState(false);
  const meta = SOURATES.find((s) => s.n === sourate) ?? SOURATES[0];

  // Enregistrement
  const [phase, setPhase] = useState<Phase>("pret");
  const [secondes, setSecondes] = useState(0);
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [erreurMicro, setErreurMicro] = useState<string | null>(null);
  const enregistreurRef = useRef<MediaRecorder | null>(null);
  const morceauxRef = useRef<Blob[]>([]);
  const minuterieRef = useRef<number | null>(null);
  const fluxRef = useRef<MediaStream | null>(null);

  // Connexion par e-mail
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState<"non" | "envoi" | "envoye">("non");

  const charger = useCallback(() => {
    fetch("/api/recitation/etat", { cache: "no-store" })
      .then((r) => r.json())
      .then(setEtat)
      .catch(() => setEtat(null));
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("merci")) {
      setMessage({ type: "ok", texte: `Merci ! ${dureeLisible(Number(p.get("merci")))} de récitation analysée ont été ajoutées à ton solde.` });
    }
    if (p.get("connecte")) setMessage({ type: "ok", texte: "Te voilà connecté·e : tes crédits sont disponibles sur cet appareil." });
    if (p.get("erreur") === "paiement") setMessage({ type: "erreur", texte: "Le paiement n'a pas pu être confirmé. Si tu as été débité·e, écris à contact@ideaforma.fr." });
    if (p.get("erreur") === "lien") setMessage({ type: "erreur", texte: "Ce lien n'est plus valable. Demande-en un nouveau ci-dessous." });
    const s = Number(p.get("s"));
    if (s >= 1 && s <= 114) setSourate(s);
    if (p.toString()) window.history.replaceState({}, "", "/recitation");
    charger();
  }, [charger]);

  // Nouveau verset au hasard quand la sourate change (mode hasard)
  const tirer = useCallback(
    (s = sourate) => {
      const m = SOURATES.find((x) => x.n === s) ?? SOURATES[0];
      const v = 1 + Math.floor(Math.random() * m.versets);
      setDe(v);
      setA(v);
      setIndice(false);
      setResultat(null);
      setPhase("pret");
    },
    [sourate]
  );

  useEffect(() => {
    if (mode === "hasard") tirer(sourate);
    else {
      setDe(1);
      setA(Math.min(3, meta.versets));
      setResultat(null);
      setPhase("pret");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourate, mode]);

  /* ---- Enregistrement ---- */
  const arreterFlux = () => {
    fluxRef.current?.getTracks().forEach((t) => t.stop());
    fluxRef.current = null;
    if (minuterieRef.current !== null) {
      window.clearInterval(minuterieRef.current);
      minuterieRef.current = null;
    }
  };

  const demarrer = async () => {
    setErreurMicro(null);
    setResultat(null);
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErreurMicro("Ton navigateur ne permet pas l'enregistrement. Sur iPhone, utilise Safari ou l'appli installée.");
      return;
    }
    try {
      const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
      fluxRef.current = flux;
      const type = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find((t) =>
        MediaRecorder.isTypeSupported(t)
      );
      const rec = new MediaRecorder(flux, type ? { mimeType: type } : undefined);
      morceauxRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) morceauxRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(morceauxRef.current, { type: rec.mimeType || "audio/webm" });
        arreterFlux();
        envoyer(blob, rec.mimeType);
      };
      enregistreurRef.current = rec;
      rec.start(250);
      setSecondes(0);
      setPhase("enregistre");
      const debut = Date.now();
      const max = etat?.tarif.dureeMax ?? 90;
      minuterieRef.current = window.setInterval(() => {
        const s = Math.floor((Date.now() - debut) / 1000);
        setSecondes(s);
        if (s >= max) arreter();
      }, 250);
    } catch {
      setErreurMicro("Micro inaccessible : autorise l'accès au micro dans les réglages du navigateur.");
      arreterFlux();
    }
  };

  const arreter = () => {
    const rec = enregistreurRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    enregistreurRef.current = null;
  };

  const annuler = () => {
    const rec = enregistreurRef.current;
    if (rec) rec.onstop = null;
    if (rec && rec.state !== "inactive") rec.stop();
    enregistreurRef.current = null;
    arreterFlux();
    setPhase("pret");
  };

  const envoyer = async (blob: Blob, mime: string) => {
    setPhase("analyse");
    const ext = mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : "webm";
    const corps = new FormData();
    corps.append("audio", blob, `recitation.${ext}`);
    corps.append("sourate", String(sourate));
    corps.append("de", String(de));
    corps.append("a", String(a));
    try {
      const r = await fetch("/api/recitation/analyser", { method: "POST", body: corps });
      const json = await r.json();
      if (!r.ok) {
        setMessage({ type: "erreur", texte: json.message ?? "L'analyse a échoué, réessaie." });
        setPhase("pret");
        charger();
        return;
      }
      setResultat(json as Resultat);
      setPhase("resultat");
      setEtat((e) =>
        e
          ? {
              ...e,
              secondes: json.reste ?? e.secondes,
              essaisRestants: json.essaisRestants ?? e.essaisRestants,
            }
          : e
      );
    } catch {
      setMessage({ type: "erreur", texte: "Connexion perdue pendant l'analyse. Réessaie." });
      setPhase("pret");
    }
  };

  useEffect(() => () => arreterFlux(), []);

  const demanderLien = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi("envoi");
    const r = await fetch("/api/recitation/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setEnvoi(r.ok ? "envoye" : "non");
    if (!r.ok) setMessage({ type: "erreur", texte: "Envoi impossible, vérifie l'adresse." });
  };

  const deconnecter = async () => {
    await fetch("/api/recitation/deconnexion", { method: "POST" });
    charger();
  };

  const peutReciter =
    !!etat && (etat.connecte ? (etat.secondes ?? 0) > 0 : (etat.essaisRestants ?? 0) > 0);
  const tarif = etat?.tarif;
  const libellePassage = de === a ? `verset ${de}` : `versets ${de} à ${a}`;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
      <Entete />

      <EnTeteRubrique
        surtitre="Lire & apprendre"
        titre="Récitation"
        teinte="#2a7f8f"
        filigrane="التلاوة"
        texte="Récite de mémoire, l'appli écoute et te montre mot à mot ce qui est juste, approximatif ou oublié."
        enfants={
          etat ? (
            <div className="mt-4 flex items-end gap-3">
              <span className="chiffre-edito" style={{ fontSize: "3rem", color: "var(--accent-fort)" }}>
                {etat.connecte ? dureeLisible(etat.secondes ?? 0) : `${etat.essaisRestants ?? 0}/${etat.essaisTotal ?? 3}`}
              </span>
              <span className="pb-1 text-sm leading-tight">
                <span className="block font-extrabold">{etat.connecte ? "de crédit restant" : "essais offerts"}</span>
                <span className="block" style={{ color: "var(--muted)" }}>
                  {etat.connecte ? etat.email : "puis crédits à prix coûtant"}
                </span>
              </span>
            </div>
          ) : null
        }
      />

      {message && (
        <div
          className="card mt-4 flex items-start gap-2 rounded-2xl p-3 text-sm"
          style={{ borderColor: message.type === "ok" ? "#2e7d5b" : "#b4452f" }}
        >
          {message.type === "ok" ? <Verifie taille={16} className="mt-0.5 shrink-0" /> : <Alerte taille={16} className="mt-0.5 shrink-0" />}
          <span className="flex-1">{message.texte}</span>
          <button onClick={() => setMessage(null)} aria-label="Fermer" className="font-bold" style={{ color: "var(--muted)" }}>
            ✕
          </button>
        </div>
      )}

      {/* ===== Choix du passage ===== */}
      <div className="titre-edito">
        <small>I</small>
        <h2>Le passage</h2>
      </div>
      <ChoixSourate valeur={sourate} libelle="Sourate à réciter" surChoix={setSourate} />

      <div className="mt-3 flex gap-2">
        {(
          [
            { id: "hasard", nom: "Verset au hasard" },
            { id: "choix", nom: "Je choisis les versets" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="flex-1 rounded-full border px-4 py-2 text-sm font-bold transition active:scale-95"
            style={{
              borderColor: mode === m.id ? "var(--accent)" : "var(--border)",
              backgroundColor: mode === m.id ? "var(--accent-fort)" : "var(--card)",
              color: mode === m.id ? "var(--sur-accent)" : "var(--text)",
            }}
          >
            {m.nom}
          </button>
        ))}
      </div>

      {mode === "choix" && (
        <div className="card mt-3 flex flex-wrap items-center gap-3 rounded-2xl p-3 text-sm font-bold">
          <label className="flex items-center gap-2">
            Du verset
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={meta.versets}
              value={de}
              onChange={(e) => {
                const v = Math.min(meta.versets, Math.max(1, Number(e.target.value) || 1));
                setDe(v);
                if (a < v) setA(v);
                setResultat(null);
                setPhase("pret");
              }}
              className="w-20 rounded-full border px-3 py-1 outline-none"
              style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--text)" }}
            />
          </label>
          <label className="flex items-center gap-2">
            au verset
            <input
              type="number"
              inputMode="numeric"
              min={de}
              max={meta.versets}
              value={a}
              onChange={(e) => {
                setA(Math.min(meta.versets, Math.max(de, Number(e.target.value) || de)));
                setResultat(null);
                setPhase("pret");
              }}
              className="w-20 rounded-full border px-3 py-1 outline-none"
              style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--text)" }}
            />
          </label>
          <span className="text-xs font-normal" style={{ color: "var(--muted)" }}>
            (max. {tarif?.dureeMax ?? 90} s d&apos;enregistrement)
          </span>
        </div>
      )}

      {/* ===== Le défi ===== */}
      <div className="titre-edito">
        <small>II</small>
        <h2>Récite</h2>
      </div>
      <section className="card relief rounded-3xl p-5 text-center">
        <p className="hero-surtitre justify-center">{meta.nom} — {libellePassage}</p>
        <p className={`arabic mt-3 text-3xl ${prefs.police}`} dir="rtl" style={{ color: "var(--accent-fort)" }}>
          {meta.arabe}
        </p>

        {phase !== "resultat" && (
          <>
            <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
              {de === a
                ? `Récite le verset ${de} de mémoire, puis arrête l'enregistrement.`
                : `Récite les versets ${de} à ${a} d'une traite, puis arrête l'enregistrement.`}
            </p>
            <div className="mt-5 flex flex-col items-center gap-3">
              {phase === "pret" && (
                <button
                  onClick={demarrer}
                  disabled={!peutReciter || !etat}
                  className="flex h-24 w-24 items-center justify-center rounded-full shadow-soft transition hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
                  aria-label="Commencer l'enregistrement"
                >
                  <Micro taille={38} />
                </button>
              )}
              {phase === "enregistre" && (
                <>
                  <button
                    onClick={arreter}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full shadow-soft transition active:scale-95"
                    style={{ background: "#b4452f", color: "#fff" }}
                    aria-label="Arrêter et analyser"
                  >
                    <span className="absolute inset-0 animate-ping rounded-full opacity-30" style={{ background: "#b4452f" }} />
                    <span className="relative h-8 w-8 rounded-md bg-white" />
                  </button>
                  <p className="chiffre-edito tabular-nums" style={{ fontSize: "2rem" }}>
                    {String(Math.floor(secondes / 60)).padStart(2, "0")}:{String(secondes % 60).padStart(2, "0")}
                  </p>
                  <button onClick={annuler} className="text-xs font-bold underline" style={{ color: "var(--muted)" }}>
                    Annuler
                  </button>
                </>
              )}
              {phase === "analyse" && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <span className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: "var(--accent) transparent var(--accent) var(--accent)" }} />
                  <p className="text-sm font-bold">Écoute et comparaison…</p>
                </div>
              )}
              {phase === "pret" && (
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {!etat
                    ? "Chargement…"
                    : peutReciter
                      ? "Touche le micro, récite, puis touche à nouveau pour arrêter."
                      : etat.connecte
                        ? "Ton solde est épuisé : recharge ci-dessous pour continuer."
                        : "Tes essais offerts sont utilisés : recharge ci-dessous pour continuer."}
                </p>
              )}
              {erreurMicro && (
                <p className="text-sm" style={{ color: "#b4452f" }}>
                  {erreurMicro}
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={() => setIndice((x) => !x)} className="pilule-claire text-xs">
                {indice ? "Cacher l'indice" : "Un indice (premiers mots)"}
              </button>
              {mode === "hasard" && (
                <button onClick={() => tirer()} className="pilule-claire text-xs">
                  Un autre verset
                </button>
              )}
              <Link href={`/sourate/${sourate}#v-${de}`} className="pilule-claire text-xs">
                Voir dans le Lecteur
              </Link>
            </div>
            {indice && <Indice sourate={sourate} verset={de} police={prefs.police} />}
          </>
        )}

        {phase === "resultat" && resultat && (
          <div className="mt-4 text-left">
            <div className="flex items-center justify-center gap-4">
              <span
                className="chiffre-edito"
                style={{ fontSize: "3.6rem", color: resultat.score >= 90 ? "#2e7d5b" : resultat.score >= 60 ? "var(--accent-fort)" : "#b4452f" }}
              >
                {resultat.score}
                <span className="text-xl">%</span>
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-extrabold">
                  {resultat.score >= 95
                    ? "Mâ shâ' Allâh, impeccable !"
                    : resultat.score >= 80
                      ? "Très bien, quelques détails."
                      : resultat.score >= 50
                        ? "Bon début, continue à réviser."
                        : "À retravailler, courage !"}
                </span>
                <span className="block" style={{ color: "var(--muted)" }}>
                  {resultat.mots.filter((m) => m.etat === "manque").length} mot(s) oublié(s) ·{" "}
                  {resultat.mots.filter((m) => m.etat === "approx").length} approximatif(s)
                  {resultat.enTrop.length ? ` · ${resultat.enTrop.length} en trop` : ""}
                </span>
              </span>
            </div>

            <p className={`arabic mt-5 text-2xl leading-loose ${prefs.police}`} dir="rtl">
              {resultat.mots.map((m, i) => (
                <span
                  key={i}
                  title={m.etat === "approx" && m.entendu ? `Entendu : ${m.entendu}` : m.etat === "manque" ? "Oublié" : undefined}
                  className="mx-0.5 inline-block rounded-md px-1"
                  style={{
                    background:
                      m.etat === "ok"
                        ? "transparent"
                        : m.etat === "approx"
                          ? "color-mix(in srgb, var(--accent) 28%, transparent)"
                          : "rgba(180, 69, 47, 0.18)",
                    color: m.etat === "manque" ? "#b4452f" : "var(--text)",
                    textDecoration: m.etat === "manque" ? "underline dotted" : undefined,
                  }}
                >
                  {m.mot}
                </span>
              ))}
            </p>
            <p className="mt-2 flex flex-wrap gap-3 text-[11px] font-bold" style={{ color: "var(--muted)" }}>
              <span>■ juste</span>
              <span style={{ color: "var(--accent-fort)" }}>■ approximatif</span>
              <span style={{ color: "#b4452f" }}>■ oublié</span>
            </p>
            {resultat.enTrop.length > 0 && (
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                Mots entendus qui ne sont pas dans le passage :{" "}
                <span className="arabic" dir="rtl">{resultat.enTrop.join(" ، ")}</span>
              </p>
            )}
            <details className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
              <summary className="cursor-pointer font-bold">Ce que l&apos;IA a entendu</summary>
              <p className="arabic mt-1 text-base leading-loose" dir="rtl">
                {resultat.transcription || "—"}
              </p>
              <p className="mt-1">
                {resultat.secondes} s analysée{resultat.secondes > 1 ? "s" : ""}
                {resultat.reste !== null ? ` · reste ${dureeLisible(resultat.reste)}` : ""}
                {resultat.essaisRestants !== null ? ` · ${resultat.essaisRestants} essai(s) offert(s) restant(s)` : ""}
              </p>
            </details>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  setResultat(null);
                  setPhase("pret");
                }}
                className="pilule-pleine"
              >
                Réessayer
              </button>
              {mode === "hasard" ? (
                <button onClick={() => tirer()} className="pilule-claire">
                  Verset suivant
                </button>
              ) : (
                <button
                  onClick={() => {
                    const n = a - de + 1;
                    const nd = Math.min(meta.versets, a + 1);
                    setDe(nd);
                    setA(Math.min(meta.versets, nd + n - 1));
                    setResultat(null);
                    setPhase("pret");
                  }}
                  className="pilule-claire"
                >
                  Passage suivant
                </button>
              )}
              <Link href={`/sourate/${sourate}#v-${de}`} className="pilule-claire">
                Relire dans le Lecteur
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ===== Historique ===== */}
      {etat?.connecte && (etat.historique?.length ?? 0) > 0 && (
        <>
          <div className="titre-edito">
            <small>III</small>
            <h2>Tes dernières récitations</h2>
          </div>
          <ul className="cascade space-y-2">
            {etat.historique!.slice(0, 8).map((h, i) => {
              const s = SOURATES.find((x) => x.n === h.sourate);
              return (
                <li key={i} className="card flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm">
                  <span>
                    <span className="font-bold">{s?.nom ?? h.sourate}</span>{" "}
                    <span style={{ color: "var(--muted)" }}>
                      {h.de === h.a ? `v. ${h.de}` : `v. ${h.de}-${h.a}`} ·{" "}
                      {new Date(h.quand).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </span>
                  </span>
                  <span
                    className="chiffre-edito"
                    style={{ fontSize: "1.5rem", color: h.score >= 90 ? "#2e7d5b" : h.score >= 60 ? "var(--accent-fort)" : "#b4452f" }}
                  >
                    {h.score}%
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* ===== Tarif transparent & crédits ===== */}
      <div className="titre-edito">
        <small>{etat?.connecte && (etat.historique?.length ?? 0) > 0 ? "IV" : "III"}</small>
        <h2>Crédits, à prix coûtant</h2>
      </div>
      {tarif && (
        <section className="card rounded-3xl p-5">
          <p className="text-sm">
            L&apos;analyse vocale est faite par OpenAI et facturée au temps d&apos;écoute :{" "}
            <strong>{(tarif.coutMinute / 100).toLocaleString("fr-FR", { minimumFractionDigits: 4 })} € la minute</strong>.
            Je ne prends aucune commission : tu paies exactement ce que tu consommes.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl p-3" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
              <p className="chiffre-edito" style={{ fontSize: "1.7rem" }}>{euros(tarif.prixPack)}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>le pack</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}>
              <p className="chiffre-edito" style={{ fontSize: "1.7rem" }}>− {euros(tarif.frais)}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>frais bancaires Stripe</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: "color-mix(in srgb, #2e7d5b 12%, transparent)" }}>
              <p className="chiffre-edito" style={{ fontSize: "1.7rem", color: "#2e7d5b" }}>≈ {dureeLisible(tarif.secondes)}</p>
              <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>de récitation analysée</p>
            </div>
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
            Frais Stripe : {tarif.fraisPourcent.toLocaleString("fr-FR")} % + {euros(tarif.fraisFixe)} par paiement (carte européenne) ; le reste, {euros(tarif.net)}, est entièrement
            converti en temps d&apos;analyse. Le solde est crédité tout de suite après le paiement et ne périme pas.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {tarif.lien ? (
              <a href={tarif.lien} className="pilule-pleine">
                Recharger {euros(tarif.prixPack)}
              </a>
            ) : (
              <span className="text-xs font-bold" style={{ color: "#b4452f" }}>
                Lien de paiement non configuré.
              </span>
            )}
            {etat?.connecte && (
              <button onClick={deconnecter} className="pilule-claire text-xs">
                Se déconnecter
              </button>
            )}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
            <Cadenas taille={13} /> Paiement sécurisé par Stripe ; ton e-mail sert uniquement à retrouver ton solde.
          </p>

          {!etat?.connecte && (
            <form onSubmit={demanderLien} className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <p className="text-sm font-bold">Déjà des crédits sur un autre appareil ?</p>
              {envoi === "envoye" ? (
                <p className="mt-2 text-sm" style={{ color: "#2e7d5b" }}>
                  Lien envoyé ! Ouvre l&apos;e-mail sur cet appareil (valable 15 minutes).
                </p>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.fr"
                    className="min-w-0 flex-1 rounded-full border px-4 py-2 text-sm outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--text)" }}
                  />
                  <button type="submit" disabled={envoi === "envoi"} className="pilule-claire text-xs disabled:opacity-60">
                    {envoi === "envoi" ? "Envoi…" : "Recevoir un lien"}
                  </button>
                </div>
              )}
            </form>
          )}
        </section>
      )}

      {/* ===== Soutien ===== */}
      <Link
        href="/soutien"
        className="card relief mt-4 flex items-center gap-4 rounded-3xl p-4 transition active:scale-[0.98]"
        style={{ borderColor: "color-mix(in srgb, #b04a6f 45%, var(--border))" }}
      >
        <span className="tuile-icone" style={{ color: "#b04a6f" }}>
          <Coeur taille={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold">Cette appli est faite bénévolement</span>
          <span className="block text-xs" style={{ color: "var(--muted)" }}>
            Les crédits couvrent seulement OpenAI. Si tu veux soutenir le projet (serveurs, domaine, temps), c&apos;est par ici — montant libre.
          </span>
        </span>
        <span className="font-bold" style={{ color: "var(--accent-fort)" }}>→</span>
      </Link>
    </div>
  );
}

/** Premiers mots du verset (indice), chargés depuis le texte de la sourate. */
function Indice({ sourate, verset, police }: { sourate: number; verset: number; police: string }) {
  const [texte, setTexte] = useState<string | null>(null);
  useEffect(() => {
    let annule = false;
    setTexte(null);
    import("@/lib/coran").then(({ chargerSourate }) =>
      chargerSourate(sourate)
        .then((d) => {
          if (annule) return;
          const v = d.verses.find((x) => x.n === verset);
          const mots = v ? v.words.slice(0, 3).map((w) => w.segments.map((s) => s.t).join("")) : [];
          setTexte(mots.join(" ") + (v && v.words.length > 3 ? " …" : ""));
        })
        .catch(() => !annule && setTexte("—"))
    );
    return () => {
      annule = true;
    };
  }, [sourate, verset]);
  return (
    <p className={`arabic mt-3 text-2xl ${police}`} dir="rtl" style={{ color: "var(--muted)" }}>
      {texte ?? "…"}
    </p>
  );
}
