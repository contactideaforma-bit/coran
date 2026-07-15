"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  METHODES,
  chargerHoraires,
  ecrireConfigPriere,
  lireConfigPriere,
  prochainePriere,
  type ConfigPriere,
  type HorairesJour,
} from "@/lib/prieres";
import {
  demanderPermission,
  ecrireNotifs,
  notifsActivees,
  notifsSupportees,
} from "@/lib/notifications";
import { abonnerPush, desabonnerPush, pushSupporte } from "@/lib/push";
import Entete from "@/components/Entete";
import {
  Alerte,
  Aube,
  Cadenas,
  Cloche,
  Epingle,
  Horloge,
  Lune,
  Soleil,
} from "@/components/Icones";

const LIGNES: {
  id: keyof HorairesJour;
  nom: string;
  icone: (p: { taille?: number }) => JSX.Element;
}[] = [
  { id: "fajr", nom: "Fajr", icone: Aube },
  { id: "lever", nom: "Lever du soleil", icone: Soleil },
  { id: "dhuhr", nom: "Dhuhr", icone: Soleil },
  { id: "asr", nom: "Asr", icone: Horloge },
  { id: "maghrib", nom: "Maghrib", icone: Lune },
  { id: "isha", nom: "Isha", icone: Lune },
];

/** « 2 h 05 » ou « 12 min » avant l'heure hh:mm donnée. */
function tempsRestant(hhmm: string, maintenant: Date): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const cible = hh * 60 + mm;
  const actuel = maintenant.getHours() * 60 + maintenant.getMinutes();
  const reste = cible - actuel;
  if (reste <= 0) return "maintenant";
  if (reste < 60) return `dans ${reste} min`;
  return `dans ${Math.floor(reste / 60)} h ${String(reste % 60).padStart(2, "0")}`;
}

/** Interrupteur du rappel de prière. */
function ToggleNotifs() {
  const [actif, setActif] = useState(false);
  const [refuse, setRefuse] = useState(false);
  const [supporte, setSupporte] = useState(true);
  const [push, setPush] = useState(false);

  // Au chargement : le push est-il déjà abonné ?
  useEffect(() => {
    if (!pushSupporte() || !notifsActivees()) return;
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg?.pushManager.getSubscription())
      .then((sub) => setPush(!!sub))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSupporte(notifsSupportees());
    setActif(notifsActivees());
    if (notifsSupportees() && Notification.permission === "denied")
      setRefuse(true);
  }, []);

  const basculer = async () => {
    if (actif) {
      ecrireNotifs(false);
      setActif(false);
      setPush(false);
      desabonnerPush();
      return;
    }
    const ok = await demanderPermission();
    if (ok) {
      ecrireNotifs(true);
      setActif(true);
      setRefuse(false);
      // Abonnement push : notifications même appli fermée (si configuré)
      const config = lireConfigPriere();
      if (config) setPush(await abonnerPush(config));
    } else {
      setRefuse(true);
    }
  };

  return (
    <div className="card rounded-2xl p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <span style={{ color: "var(--accent)" }}>
          <Cloche taille={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold">Rappel à l&apos;heure de la prière</span>
          <span className="block text-xs" style={{ color: "var(--muted)" }}>
            {!supporte
              ? "Non pris en charge par ce navigateur (sur iPhone : installe d'abord l'appli sur l'écran d'accueil)"
              : actif && push
                ? "Notifications actives, même quand l'appli est fermée"
                : "Une notification quand l'heure arrive, tant que l'appli est ouverte"}
          </span>
        </span>
        {supporte && (
          <button
            onClick={basculer}
            role="switch"
            aria-checked={actif}
            aria-label="Activer le rappel de prière"
            className="relative h-7 w-12 shrink-0 rounded-full transition"
            style={{
              backgroundColor: actif ? "var(--accent)" : "var(--border)",
            }}
          >
            <span
              className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all"
              style={{ left: actif ? "1.375rem" : "0.125rem" }}
            />
          </button>
        )}
      </div>
      {refuse && !actif && (
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          Les notifications sont bloquées pour ce site. Autorise-les dans les
          réglages de ton navigateur, puis réessaie.
        </p>
      )}
    </div>
  );
}

export default function Prieres() {
  const [config, setConfig] = useState<ConfigPriere | null>(null);
  const [charge, setCharge] = useState(false);
  const [formulaire, setFormulaire] = useState(false);
  const [horaires, setHoraires] = useState<HorairesJour | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("France");
  const [methode, setMethode] = useState(12);
  const [maintenant, setMaintenant] = useState<Date | null>(null);

  // Horloge : rafraîchir le temps restant chaque minute
  useEffect(() => {
    setMaintenant(new Date());
    const t = setInterval(() => setMaintenant(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const c = lireConfigPriere();
    setConfig(c);
    setCharge(true);
    if (c) {
      setVille(c.ville);
      setPays(c.pays);
      setMethode(c.methode);
    }
  }, []);

  useEffect(() => {
    if (!config) return;
    setHoraires(null);
    setErreur(null);
    chargerHoraires(config)
      .then(setHoraires)
      .catch(() =>
        setErreur(
          "Impossible de charger les horaires. Vérifie la ville et ta connexion."
        )
      );
  }, [config]);

  const valider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ville.trim()) return;
    const c = { ville: ville.trim(), pays: pays.trim() || "France", methode };
    ecrireConfigPriere(c);
    setConfig(c);
    setFormulaire(false);
    // Rappel push actif ? Mettre à jour la ville côté serveur
    if (notifsActivees()) abonnerPush(c).catch(() => {});
  };

  const suivante = horaires ? prochainePriere(horaires) : null;
  const montrerFormulaire = charge && (!config || formulaire);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      <section className="mt-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
        >
          ← Accueil
        </Link>
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Horloge taille={22} /> Horaires de prière
        </h2>
      </section>

      {/* Choix ville + méthode */}
      {montrerFormulaire && (
        <form
          onSubmit={valider}
          className="card pop mt-6 space-y-4 rounded-3xl p-6 shadow-soft"
        >
          <p className="font-bold">
            {config ? "Modifier mes réglages" : "Où habites-tu ?"}
          </p>
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="ville">
              Ville
            </label>
            <input
              id="ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Ex. : Lyon"
              required
              className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="pays">
              Pays
            </label>
            <input
              id="pays"
              value={pays}
              onChange={(e) => setPays(e.target.value)}
              className="w-full rounded-xl border bg-transparent px-4 py-3 outline-none"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div>
            <p className="mb-1 text-sm font-bold">Méthode de calcul</p>
            <div className="space-y-2">
              {METHODES.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border p-3"
                  style={{
                    borderColor:
                      methode === m.id ? "var(--accent)" : "var(--border)",
                    backgroundColor:
                      methode === m.id
                        ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                        : "var(--card)",
                  }}
                >
                  <input
                    type="radio"
                    name="methode"
                    checked={methode === m.id}
                    onChange={() => setMethode(m.id)}
                  />
                  <span className="text-sm font-semibold">{m.nom}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              En France, la plupart des mosquées suivent la méthode 12°. En cas
              de doute, renseigne-toi auprès de ta mosquée.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-full px-6 py-3 font-bold text-white transition active:scale-95"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Afficher les horaires
            </button>
            {config && (
              <button
                type="button"
                onClick={() => setFormulaire(false)}
                className="card rounded-full px-5 py-3 font-bold"
              >
                Annuler
              </button>
            )}
          </div>
          <p
            className="flex items-center justify-center gap-1.5 text-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            <Cadenas taille={14} /> Ta ville reste sur ton appareil.
          </p>
        </form>
      )}

      {/* Horaires du jour */}
      {config && !montrerFormulaire && (
        <div className="mt-6 space-y-4">
          <div className="card flex items-center justify-between rounded-2xl p-4 shadow-soft">
            <div>
              <p className="flex items-center gap-1.5 font-bold">
                <Epingle taille={16} className="shrink-0" /> {config.ville}
              </p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {horaires
                  ? `${new Date().toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })} • ${horaires.hijri} H`
                  : "…"}
              </p>
            </div>
            <button
              onClick={() => setFormulaire(true)}
              className="card rounded-full px-4 py-2 text-sm font-bold transition hover:scale-105 active:scale-95"
            >
              Modifier
            </button>
          </div>

          {erreur && (
            <div className="card rounded-2xl p-6 text-center shadow-soft">
              <p
                className="flex justify-center"
                style={{ color: "var(--accent)" }}
              >
                <Alerte taille={28} />
              </p>
              <p className="mt-2">{erreur}</p>
              <button
                onClick={() => setFormulaire(true)}
                className="mt-3 rounded-full px-5 py-2 font-bold text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Modifier la ville
              </button>
            </div>
          )}

          {!horaires && !erreur && (
            <div className="card rounded-2xl p-8 text-center shadow-soft">
              <p
                className="flex animate-pulse justify-center"
                style={{ color: "var(--accent)" }}
              >
                <Horloge taille={36} />
              </p>
              <p className="mt-2 font-bold">Chargement des horaires…</p>
            </div>
          )}

          {horaires && (
            <ul className="space-y-2">
              {LIGNES.map((l) => {
                const estSuivante = suivante === l.id;
                return (
                  <li
                    key={l.id}
                    className="card flex items-center justify-between rounded-2xl px-5 py-4 shadow-soft"
                    style={
                      estSuivante
                        ? {
                            boxShadow: "0 0 0 2px var(--accent)",
                            backgroundColor:
                              "color-mix(in srgb, var(--accent) 10%, var(--card))",
                          }
                        : undefined
                    }
                  >
                    <span className="flex items-center gap-3 font-bold">
                      <span style={{ color: "var(--accent)" }}>
                        <l.icone taille={20} />
                      </span>
                      {l.nom}
                      {estSuivante && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: "var(--accent)" }}
                        >
                          {maintenant
                            ? tempsRestant(horaires[l.id], maintenant)
                            : "Prochaine"}
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-extrabold tabular-nums">
                      {horaires[l.id]}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <ToggleNotifs />

          <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
            Source : AlAdhan.com •{" "}
            {METHODES.find((m) => m.id === config.methode)?.nom}
          </p>
        </div>
      )}
    </div>
  );
}
