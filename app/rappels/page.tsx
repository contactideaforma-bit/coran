"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { lireConfigPriere, type ConfigPriere } from "@/lib/prieres";
import {
  activerNotifs,
  desactiverNotifs,
  montrerNotification,
  notifsActivees,
  notifsSupportees,
  pushActif,
  pushSupporte,
  synchroniserAbonnement,
} from "@/lib/notifications";
import {
  JOURS,
  MESSAGE_RAPPEL_DEFAUT,
  NOMS_PRIERES,
  PRIERES_NOTIFIABLES,
  ecrireConfigNotifs,
  libelleJours,
  lireConfigNotifs,
  nouvelId,
  type ConfigNotifs,
  type RappelCoran,
} from "@/lib/rappels";
import Entete from "@/components/Entete";
import { Cloche, Horloge, LivreOuvert, Verifie } from "@/components/Icones";

/** Interrupteur rond (même style que la page prières). */
function Interrupteur({
  actif,
  changer,
  label,
}: {
  actif: boolean;
  changer: () => void;
  label: string;
}) {
  return (
    <button
      onClick={changer}
      role="switch"
      aria-checked={actif}
      aria-label={label}
      className="relative h-7 w-12 shrink-0 rounded-full transition"
      style={{ backgroundColor: actif ? "var(--accent-fort)" : "var(--border)" }}
    >
      <span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all"
        style={{ left: actif ? "1.375rem" : "0.125rem" }}
      />
    </button>
  );
}

const AVANCES = [0, 5, 10, 15];

export default function Rappels() {
  const [pret, setPret] = useState(false);
  const [supporte, setSupporte] = useState(true);
  const [actif, setActif] = useState(false);
  const [mode, setMode] = useState<"push" | "local">("local");
  const [refuse, setRefuse] = useState(false);
  const [occupe, setOccupe] = useState(false);
  const [config, setConfig] = useState<ConfigNotifs>(lireConfigNotifs);
  const [priere, setPriere] = useState<ConfigPriere | null>(null);
  const [formulaire, setFormulaire] = useState(false);
  const [heure, setHeure] = useState("07:00");
  const [jours, setJours] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const [message, setMessage] = useState(MESSAGE_RAPPEL_DEFAUT);
  const [testEnvoye, setTestEnvoye] = useState(false);

  useEffect(() => {
    setSupporte(notifsSupportees());
    setActif(notifsActivees());
    setMode(pushActif() ? "push" : "local");
    setRefuse(notifsSupportees() && Notification.permission === "denied");
    setConfig(lireConfigNotifs());
    setPriere(lireConfigPriere());
    setPret(true);
  }, []);

  /** Sauvegarde locale + synchro serveur. */
  const enregistrer = (c: ConfigNotifs) => {
    setConfig(c);
    ecrireConfigNotifs(c);
    synchroniserAbonnement();
  };

  const basculerTout = async () => {
    if (occupe) return;
    setOccupe(true);
    try {
      if (actif) {
        await desactiverNotifs();
        setActif(false);
      } else {
        const resultat = await activerNotifs();
        if (resultat === "refuse") {
          setRefuse(true);
        } else {
          setActif(true);
          setRefuse(false);
          setMode(resultat);
        }
      }
    } finally {
      setOccupe(false);
    }
  };

  const basculerPriere = (p: (typeof PRIERES_NOTIFIABLES)[number]) =>
    enregistrer({
      ...config,
      prieres: { ...config.prieres, [p]: !config.prieres[p] },
    });

  const basculerJour = (j: number) =>
    setJours((l) => (l.includes(j) ? l.filter((x) => x !== j) : [...l, j]));

  const ajouterRappel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heure || jours.length === 0) return;
    const r: RappelCoran = {
      id: nouvelId(),
      heure,
      jours,
      message: message.trim() || MESSAGE_RAPPEL_DEFAUT,
      actif: true,
    };
    enregistrer({ ...config, rappels: [...config.rappels, r] });
    setFormulaire(false);
    setMessage(MESSAGE_RAPPEL_DEFAUT);
  };

  const basculerRappel = (id: string) =>
    enregistrer({
      ...config,
      rappels: config.rappels.map((r) =>
        r.id === id ? { ...r, actif: !r.actif } : r
      ),
    });

  const supprimerRappel = (id: string) =>
    enregistrer({
      ...config,
      rappels: config.rappels.filter((r) => r.id !== id),
    });

  const tester = async () => {
    await montrerNotification(
      "Test réussi ✅",
      "Les notifications de My Easy Muslim fonctionnent sur cet appareil.",
      "/rappels"
    );
    setTestEnvoye(true);
    setTimeout(() => setTestEnvoye(false), 3000);
  };

  const rappelsTries = [...config.rappels].sort((a, b) =>
    a.heure.localeCompare(b.heure)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      <section className="mt-6 flex items-center gap-3">
        <span className="tuile-icone">
          <Cloche taille={24} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold">Rappels</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Notifications pour les prières et ta lecture du Coran
          </p>
        </div>
      </section>

      {/* ===== Interrupteur général ===== */}
      <div className="card mt-5 rounded-2xl p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Activer les notifications</span>
            <span className="block text-xs" style={{ color: "var(--muted)" }}>
              {!pret
                ? ""
                : !supporte
                  ? "Non pris en charge par ce navigateur. Sur iPhone : installe d'abord l'appli sur l'écran d'accueil (Partager → Sur l'écran d'accueil), puis reviens ici."
                  : actif && mode === "push"
                    ? "Actives sur cet appareil, même appli fermée."
                    : actif
                      ? "Mode limité : les rappels partent seulement tant que l'appli est ouverte."
                      : "Reçois un rappel à l'heure des prières et aux moments que tu choisis."}
            </span>
          </span>
          {supporte && (
            <Interrupteur
              actif={actif}
              changer={basculerTout}
              label="Activer les notifications"
            />
          )}
        </div>
        {refuse && !actif && (
          <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
            Les notifications sont bloquées pour ce site. Autorise-les dans les
            réglages de ton navigateur (ou de ton téléphone, pour l&apos;appli
            installée), puis réessaie.
          </p>
        )}
        {actif && mode === "local" && pushSupporte() && (
          <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
            Le serveur de notifications n&apos;a pas répondu : réessaie plus
            tard en désactivant puis réactivant l&apos;interrupteur.
          </p>
        )}
        {actif && (
          <button
            onClick={tester}
            className="mt-3 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={{ borderColor: "var(--border)" }}
          >
            {testEnvoye ? "Notification envoyée !" : "Envoyer une notification de test"}
          </button>
        )}
      </div>

      {/* ===== Prières ===== */}
      <section className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          <Horloge taille={18} /> Prières
        </h2>
        {!priere ? (
          <div className="card mt-3 rounded-2xl p-4 shadow-soft text-sm">
            Choisis d&apos;abord ta ville dans{" "}
            <Link
              href="/prieres"
              className="font-bold underline"
              style={{ color: "var(--accent-fort)" }}
            >
              Prières
            </Link>{" "}
            pour recevoir les rappels aux bons horaires.
          </div>
        ) : (
          <div className="card mt-3 rounded-2xl p-4 shadow-soft">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Horaires de {priere.ville}. Touche une prière pour l&apos;activer
              ou la couper.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRIERES_NOTIFIABLES.map((p) => {
                const on = config.prieres[p];
                return (
                  <button
                    key={p}
                    onClick={() => basculerPriere(p)}
                    aria-pressed={on}
                    className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition"
                    style={{
                      borderColor: on ? "var(--accent)" : "var(--border)",
                      backgroundColor: on
                        ? "color-mix(in srgb, var(--accent) 14%, transparent)"
                        : "transparent",
                      color: on ? "var(--accent-fort)" : "var(--muted)",
                    }}
                  >
                    {on && <Verifie taille={14} />}
                    {NOMS_PRIERES[p]}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-sm font-bold">Prévenir</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AVANCES.map((a) => {
                const on = config.avance === a;
                return (
                  <button
                    key={a}
                    onClick={() => enregistrer({ ...config, avance: a })}
                    aria-pressed={on}
                    className="rounded-full border px-3 py-1.5 text-sm font-bold transition"
                    style={{
                      borderColor: on ? "var(--accent)" : "var(--border)",
                      color: on ? "var(--accent-fort)" : "var(--muted)",
                    }}
                  >
                    {a === 0 ? "à l'heure" : `${a} min avant`}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ===== Rappels Coran ===== */}
      <section className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <LivreOuvert taille={18} /> Rappels Coran
          </h2>
          {!formulaire && (
            <button
              onClick={() => setFormulaire(true)}
              className="rounded-full px-4 py-1.5 text-sm font-bold text-white"
              style={{ backgroundColor: "var(--accent-fort)" }}
            >
              + Ajouter
            </button>
          )}
        </div>

        {formulaire && (
          <form
            onSubmit={ajouterRappel}
            className="card mt-3 rounded-2xl p-4 shadow-soft"
          >
            <label className="block text-sm font-bold">
              Heure
              <input
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                required
                className="mt-1 block w-full rounded-xl border px-3 py-2 text-lg font-bold"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                }}
              />
            </label>
            <p className="mt-3 text-sm font-bold">Jours</p>
            <div className="mt-1 flex gap-1.5">
              {JOURS.map((j) => {
                const on = jours.includes(j.id);
                return (
                  <button
                    type="button"
                    key={j.id}
                    onClick={() => basculerJour(j.id)}
                    aria-pressed={on}
                    aria-label={j.nom}
                    className="h-9 w-9 rounded-full border text-sm font-bold transition"
                    style={{
                      borderColor: on ? "var(--accent)" : "var(--border)",
                      backgroundColor: on ? "var(--accent-fort)" : "transparent",
                      color: on ? "var(--sur-accent)" : "var(--muted)",
                    }}
                  >
                    {j.court}
                  </button>
                );
              })}
            </div>
            <label className="mt-3 block text-sm font-bold">
              Message
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={120}
                className="mt-1 block w-full rounded-xl border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg)",
                  color: "var(--text)",
                }}
              />
            </label>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                disabled={jours.length === 0}
                className="rounded-full px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                style={{ backgroundColor: "var(--accent-fort)" }}
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setFormulaire(false)}
                className="rounded-full border px-4 py-2 text-sm font-bold"
                style={{ borderColor: "var(--border)" }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {rappelsTries.length === 0 && !formulaire && (
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            Aucun rappel pour l&apos;instant. Programme par exemple une lecture
            après Fajr ou avant de dormir.
          </p>
        )}

        <ul className="mt-3 space-y-2">
          {rappelsTries.map((r) => (
            <li
              key={r.id}
              className="card flex items-center gap-3 rounded-2xl p-4 shadow-soft"
              style={{ opacity: r.actif ? 1 : 0.6 }}
            >
              <span className="text-2xl font-extrabold tabular-nums">
                {r.heure}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">
                  {r.message}
                </span>
                <span className="block text-xs" style={{ color: "var(--muted)" }}>
                  {libelleJours(r.jours)}
                </span>
              </span>
              <Interrupteur
                actif={r.actif}
                changer={() => basculerRappel(r.id)}
                label="Activer ce rappel"
              />
              <button
                onClick={() => supprimerRappel(r.id)}
                aria-label="Supprimer ce rappel"
                className="text-lg"
                style={{ color: "var(--muted)" }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      {actif && mode === "local" && (
        <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
          Sur cet appareil, les rappels ne partent que si l&apos;appli est
          ouverte ou récemment utilisée.
        </p>
      )}
    </div>
  );
}
