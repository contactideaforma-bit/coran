"use client";

/* Assistant IA (abonnement 2,99 €/mois via Stripe).
 *
 * États : chargement → non connecté (présentation + abonnement + lien de
 * connexion par e-mail) → connecté inactif → connecté actif (conversation).
 * La conversation est gardée dans localStorage (coran-ia-conversation).
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Entete from "@/components/Entete";
import VersetCite from "@/components/VersetCite";
import { Etincelles, Verifie, Alerte } from "@/components/Icones";
import { QUESTIONS_SUGGEREES } from "@/data/ia";
import type { ReponseIa } from "@/lib/ia-serveur";

const CLE_CONVERSATION = "coran-ia-conversation";
const LIEN_ABONNEMENT = process.env.NEXT_PUBLIC_LIEN_ABONNEMENT_IA ?? "";

interface Etat {
  connecte: boolean;
  email?: string;
  actif?: boolean;
  restant?: number;
  quota?: number;
}

interface Echange {
  question: string;
  reponse: ReponseIa | null; // null = en attente
  erreur?: string;
}

export default function PageIa() {
  const [etat, setEtat] = useState<Etat | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "erreur"; texte: string } | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("bienvenue")) setMessage({ type: "ok", texte: "Bienvenue ! Ton abonnement est actif, tu peux poser ta première question." });
    if (p.get("erreur") === "paiement") setMessage({ type: "erreur", texte: "Le paiement n'a pas pu être confirmé. Si tu as été débité, écris-nous : contact@ideaforma.fr." });
    if (p.get("erreur") === "lien") setMessage({ type: "erreur", texte: "Ce lien de connexion n'est plus valable. Demande-en un nouveau ci-dessous." });
    if (p.toString()) window.history.replaceState({}, "", "/ia");
    fetch("/api/ia/etat", { cache: "no-store" })
      .then((r) => r.json())
      .then(setEtat)
      .catch(() => setEtat({ connecte: false }));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
      <Entete />
      {message && (
        <p
          className="mt-4 rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: message.type === "ok" ? "var(--accent-fort)" : "#b04a6f",
            color: message.type === "ok" ? "var(--accent-fort)" : "#b04a6f",
          }}
        >
          {message.texte}
        </p>
      )}
      {etat === null && (
        <p className="mt-8 text-center text-sm" style={{ color: "var(--muted)" }}>
          Chargement…
        </p>
      )}
      {etat && !etat.connecte && <Presentation />}
      {etat && etat.connecte && !etat.actif && <AbonnementInactif email={etat.email ?? ""} />}
      {etat && etat.connecte && etat.actif && <Conversation etat={etat} setEtat={setEtat} />}
    </div>
  );
}

/* ===== Non connecté ===== */

function Presentation() {
  return (
    <>
      <section
        className="card mt-6 rounded-3xl p-5 shadow-soft"
        style={{ background: "linear-gradient(160deg, color-mix(in srgb, var(--accent) 14%, var(--card)), var(--card) 70%)" }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: "color-mix(in srgb, var(--accent) 18%, var(--card))", color: "var(--accent-fort)" }}
        >
          <Etincelles taille={26} />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold" style={{ fontFamily: "Marcellus, serif" }}>
          Assistant My Easy Coran
        </h1>
        <p className="mt-2 text-sm leading-relaxed">
          Pose tes questions sur l&apos;islam et reçois une réponse construite à partir du Coran, de la
          Sunna authentique (hadiths sahîh et hasan) et des avis de savants reconnus — chaque réponse
          cite ses sources, et les versets s&apos;affichent en arabe et en français.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            "Versets cités avec leur référence exacte, affichés depuis le texte coranique",
            "Hadiths authentiques uniquement, avec recueil et grade",
            "Avis des savants attribués, divergences expliquées sans imposer d'école",
            "Jusqu'à 30 questions par jour, sans engagement, résiliable en un clic",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <span style={{ color: "var(--accent-fort)" }}>
                <Verifie taille={18} />
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <a
          href={LIEN_ABONNEMENT || "#"}
          className="mt-5 block rounded-full px-5 py-3 text-center font-extrabold shadow-soft transition active:scale-[0.98]"
          style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
        >
          S&apos;abonner — 2,99 € / mois
        </a>
        <p className="mt-2 text-center text-xs" style={{ color: "var(--muted)" }}>
          Paiement sécurisé par Stripe. Tu reçois ton accès immédiatement après le paiement.
        </p>
      </section>

      <Avertissement />

      <FormulaireConnexion />
    </>
  );
}

function FormulaireConnexion() {
  const [email, setEmail] = useState("");
  const [envoi, setEnvoi] = useState<"idle" | "en-cours" | "envoye" | "erreur">("idle");

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi("en-cours");
    try {
      const r = await fetch("/api/ia/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setEnvoi(r.ok ? "envoye" : "erreur");
    } catch {
      setEnvoi("erreur");
    }
  };

  return (
    <section className="card mt-4 rounded-3xl p-5 shadow-soft">
      <h2 className="font-extrabold">Déjà abonné ?</h2>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Saisis l&apos;adresse e-mail utilisée lors du paiement : tu recevras un lien pour ouvrir
        l&apos;assistant sur cet appareil.
      </p>
      {envoi === "envoye" ? (
        <p className="mt-3 text-sm font-bold" style={{ color: "var(--accent-fort)" }}>
          Si un abonnement existe pour cette adresse, un lien vient de t&apos;être envoyé (pense à
          vérifier les courriers indésirables).
        </p>
      ) : (
        <form onSubmit={envoyer} className="mt-3 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.fr"
            className="min-w-0 flex-1 rounded-full border px-4 py-2 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--text)" }}
          />
          <button
            type="submit"
            disabled={envoi === "en-cours"}
            className="rounded-full px-4 py-2 text-sm font-bold"
            style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
          >
            {envoi === "en-cours" ? "…" : "Recevoir le lien"}
          </button>
        </form>
      )}
      {envoi === "erreur" && (
        <p className="mt-2 text-xs" style={{ color: "#b04a6f" }}>
          Envoi impossible pour le moment, réessaie dans un instant.
        </p>
      )}
    </section>
  );
}

function Avertissement() {
  return (
    <p
      className="mt-4 flex gap-2 rounded-2xl border px-4 py-3 text-xs leading-relaxed"
      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
    >
      <span className="shrink-0" style={{ color: "var(--accent-fort)" }}>
        <Alerte taille={16} />
      </span>
      <span>
        L&apos;assistant est une aide à la compréhension, pas une autorité religieuse : ses réponses
        ne remplacent pas l&apos;avis d&apos;un savant ou d&apos;un imam pour ta situation personnelle.
        Vérifie toujours les références citées.
      </span>
    </p>
  );
}

/* ===== Connecté, abonnement inactif ===== */

function AbonnementInactif({ email }: { email: string }) {
  return (
    <section className="card mt-6 rounded-3xl p-5 shadow-soft">
      <h1 className="text-xl font-extrabold">Abonnement inactif</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        L&apos;abonnement lié à {email} n&apos;est plus actif (résilié ou paiement en échec).
      </p>
      <a
        href={LIEN_ABONNEMENT || "#"}
        className="mt-4 block rounded-full px-5 py-3 text-center font-extrabold"
        style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
      >
        Reprendre l&apos;abonnement — 2,99 € / mois
      </a>
      <BoutonsCompte />
    </section>
  );
}

function BoutonsCompte() {
  const portail = async () => {
    const r = await fetch("/api/ia/portail", { method: "POST" });
    const j = await r.json();
    if (j.url) window.location.href = j.url;
  };
  const deconnexion = async () => {
    await fetch("/api/ia/deconnexion", { method: "POST" });
    window.location.href = "/ia";
  };
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
      <button onClick={portail} className="underline">
        Gérer mon abonnement
      </button>
      <button onClick={deconnexion} className="underline">
        Se déconnecter
      </button>
    </div>
  );
}

/* ===== Conversation ===== */

function Conversation({ etat, setEtat }: { etat: Etat; setEtat: (e: Etat) => void }) {
  const [echanges, setEchanges] = useState<Echange[]>([]);
  const [question, setQuestion] = useState("");
  const [enCours, setEnCours] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE_CONVERSATION);
      if (brut) setEchanges((JSON.parse(brut) as Echange[]).filter((e) => e.reponse));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CLE_CONVERSATION, JSON.stringify(echanges.filter((e) => e.reponse).slice(-20)));
    } catch {}
    if (echanges.length) finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [echanges]);

  const poser = async (q: string) => {
    const texte = q.trim();
    if (!texte || enCours) return;
    setQuestion("");
    setEnCours(true);
    const historique = echanges
      .filter((e) => e.reponse)
      .slice(-3)
      .flatMap((e) => [
        { role: "user" as const, content: e.question },
        { role: "assistant" as const, content: e.reponse!.reponse },
      ]);
    setEchanges((l) => [...l, { question: texte, reponse: null }]);
    try {
      const r = await fetch("/api/ia/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: texte, historique }),
      });
      const j = await r.json();
      if (j.ok) {
        setEchanges((l) => l.map((e, i) => (i === l.length - 1 ? { ...e, reponse: j.reponse } : e)));
        setEtat({ ...etat, restant: j.restant });
      } else {
        const msg =
          j.code === "quota"
            ? `Tu as atteint les ${j.quota} questions du jour. À demain, in shâ Allah !`
            : j.code === "inactif"
              ? "Ton abonnement n'est plus actif."
              : "Réponse impossible pour le moment, réessaie dans un instant.";
        setEchanges((l) => l.map((e, i) => (i === l.length - 1 ? { ...e, erreur: msg } : e)));
        if (j.code === "inactif") setEtat({ ...etat, actif: false });
      }
    } catch {
      setEchanges((l) =>
        l.map((e, i) => (i === l.length - 1 ? { ...e, erreur: "Connexion impossible, vérifie ton réseau." } : e))
      );
    } finally {
      setEnCours(false);
    }
  };

  const effacer = () => {
    setEchanges([]);
    try {
      localStorage.removeItem(CLE_CONVERSATION);
    } catch {}
  };

  return (
    <>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs" style={{ color: "var(--muted)" }}>
        <span>
          {etat.restant} question{(etat.restant ?? 0) > 1 ? "s" : ""} restante{(etat.restant ?? 0) > 1 ? "s" : ""} aujourd&apos;hui
        </span>
        {echanges.length > 0 && (
          <button onClick={effacer} className="underline">
            Nouvelle conversation
          </button>
        )}
      </div>

      {echanges.length === 0 && (
        <section className="mt-4">
          <h1 className="text-xl font-extrabold" style={{ fontFamily: "Marcellus, serif" }}>
            Que veux-tu comprendre aujourd&apos;hui ?
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUESTIONS_SUGGEREES.map((q) => (
              <button
                key={q}
                onClick={() => poser(q)}
                className="card rounded-full px-3 py-2 text-left text-xs font-bold shadow-soft transition active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
          <Avertissement />
        </section>
      )}

      <div className="mt-4 space-y-4">
        {echanges.map((e, i) => (
          <div key={i}>
            <p
              className="ml-8 rounded-2xl rounded-br-sm px-4 py-3 text-sm"
              style={{ background: "color-mix(in srgb, var(--accent) 16%, var(--card))" }}
            >
              {e.question}
            </p>
            <div className="mt-2">
              {e.reponse ? (
                <CarteReponse r={e.reponse} />
              ) : e.erreur ? (
                <p className="text-sm" style={{ color: "#b04a6f" }}>
                  {e.erreur}
                </p>
              ) : (
                <p className="animate-pulse text-sm" style={{ color: "var(--muted)" }}>
                  Recherche dans le Coran et la Sunna…
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={finRef} />
      </div>

      <BoutonsCompte />

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          poser(question);
        }}
        className="fixed inset-x-0 z-10 px-4 pb-3"
        style={{ bottom: "var(--hauteur-onglets, 0px)" }}
      >
        <div className="entete-verre mx-auto flex max-w-2xl items-end gap-2 rounded-3xl p-2 shadow-soft">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                poser(question);
              }
            }}
            rows={1}
            placeholder="Pose ta question…"
            className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
          <button
            type="submit"
            disabled={enCours || !question.trim()}
            className="rounded-full px-4 py-2 text-sm font-extrabold disabled:opacity-50"
            style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
          >
            Envoyer
          </button>
        </div>
      </form>
      <div className="h-20" />
    </>
  );
}

function CarteReponse({ r }: { r: ReponseIa }) {
  return (
    <div className="card rounded-3xl rounded-tl-sm p-4 shadow-soft">
      {r.reponse.split(/\n{2,}/).map((p, i) => (
        <p key={i} className="mb-3 text-sm leading-relaxed last:mb-0">
          {p}
        </p>
      ))}

      {r.versets.length > 0 && (
        <div className="mt-4 space-y-2">
          <Sous>Dans le Coran</Sous>
          {r.versets.map((v) => (
            <VersetCite key={`${v.s}:${v.v}`} s={v.s} v={v.v} pourquoi={v.pourquoi} />
          ))}
        </div>
      )}

      {r.hadiths.length > 0 && (
        <div className="mt-4 space-y-2">
          <Sous>Dans la Sunna</Sous>
          {r.hadiths.map((h, i) => (
            <blockquote key={i} className="rounded-2xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
              <p className="leading-relaxed">« {h.texte} »</p>
              <footer className="mt-1 text-xs font-bold" style={{ color: "var(--accent-fort)" }}>
                {h.recueil}
                {h.numero ? ` n° ${h.numero}` : ""} — {h.grade}
              </footer>
            </blockquote>
          ))}
        </div>
      )}

      {r.savants.length > 0 && (
        <div className="mt-4">
          <Sous>Avis des savants</Sous>
          <ul className="mt-1 space-y-2 text-sm">
            {r.savants.map((s, i) => (
              <li key={i}>
                <span className="font-bold">{s.nom} :</span> {s.avis}
              </li>
            ))}
          </ul>
        </div>
      )}

      {r.divergence && (
        <div className="mt-4 rounded-2xl border p-3 text-sm" style={{ borderColor: "var(--text)" }}>
          <Sous>Divergence entre savants</Sous>
          <p className="mt-1 leading-relaxed">{r.divergence}</p>
        </div>
      )}

      {r.conseil && (
        <p className="mt-4 flex gap-2 text-sm" style={{ color: "var(--accent-fort)" }}>
          <span className="shrink-0">
            <Alerte taille={18} />
          </span>
          <span>{r.conseil}</span>
        </p>
      )}

      <p className="mt-4 text-[11px] leading-snug" style={{ color: "var(--muted)" }}>
        Réponse générée par une IA à partir des sources citées : ce n&apos;est pas une fatwa. Pour une
        situation personnelle, consulte un savant ou un imam. <Link href="/coran" className="underline">Vérifier dans le Coran</Link>.
      </p>
    </div>
  );
}

function Sous({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
      {children}
    </h3>
  );
}
