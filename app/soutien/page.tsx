"use client";

/* Soutien libre (lien de paiement Stripe, montant au choix). */

import Link from "next/link";
import { useEffect, useState } from "react";
import Entete from "@/components/Entete";
import { CoeurPlein } from "@/components/Icones";

const LIEN_SOUTIEN = process.env.NEXT_PUBLIC_LIEN_SOUTIEN ?? "";

export default function PageSoutien() {
  const [merci, setMerci] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("merci")) {
      setMerci(true);
      window.history.replaceState({}, "", "/soutien");
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
      <Entete />
      <section
        className="card mt-6 rounded-3xl p-5 shadow-soft"
        style={{ background: "linear-gradient(160deg, color-mix(in srgb, #b04a6f 12%, var(--card)), var(--card) 70%)" }}
      >
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: "color-mix(in srgb, #b04a6f 18%, var(--card))", color: "color-mix(in srgb, #b04a6f 85%, var(--text))" }}
        >
          <CoeurPlein taille={26} />
        </span>
        {merci ? (
          <>
            <h1 className="mt-4 text-2xl font-extrabold" style={{ fontFamily: "Marcellus, serif" }}>
              Jazâk Allâhu khayran
            </h1>
            <p className="mt-2 text-sm leading-relaxed">
              Merci du fond du cœur pour ton soutien. Il permet de garder My Easy Coran gratuit, sans
              publicité, et de continuer à l&apos;améliorer.
            </p>
            <Link href="/" className="mt-5 block text-center text-sm font-bold underline">
              Retour à l&apos;accueil
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-extrabold" style={{ fontFamily: "Marcellus, serif" }}>
              Soutenir My Easy Coran
            </h1>
            <p className="mt-2 text-sm leading-relaxed">
              L&apos;application est gratuite et sans publicité. Si elle t&apos;aide dans ta lecture et
              ton quotidien, tu peux participer à ses frais (serveurs, audio, développement) avec le
              montant de ton choix, une seule fois ou quand tu le souhaites. Chaque contribution est
              une aide précieuse — et une sadaqa jâriya, in shâ Allah, pour tous ceux qui liront
              grâce à elle.
            </p>
            <a
              href={LIEN_SOUTIEN || "#"}
              className="mt-5 block rounded-full px-5 py-3 text-center font-extrabold shadow-soft transition active:scale-[0.98]"
              style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
            >
              Soutenir — montant libre
            </a>
            <p className="mt-2 text-center text-xs" style={{ color: "var(--muted)" }}>
              Paiement sécurisé par Stripe (carte, Apple Pay, Google Pay). Aucune donnée bancaire ne
              transite par l&apos;application.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
