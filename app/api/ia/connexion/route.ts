import { NextResponse } from "next/server";
import {
  consommerLien,
  creerSession,
  envoyerLienConnexion,
  trouverAbonnementParEmail,
  urlSite,
} from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Étape 1 : l'abonné saisit son e-mail → lien envoyé par Resend. */
export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const e = (email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return NextResponse.json({ ok: false, message: "Adresse e-mail invalide." }, { status: 400 });
    }
    const abo = await trouverAbonnementParEmail(e);
    // Même réponse qu'il y ait un abonnement ou non : on n'indique pas si l'adresse est connue.
    if (abo) await envoyerLienConnexion(e);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Envoi impossible pour le moment." }, { status: 500 });
  }
}

/** Étape 2 : clic sur le lien reçu → session ouverte. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  try {
    const email = await consommerLien(token);
    const abo = email ? await trouverAbonnementParEmail(email) : null;
    if (!abo) return NextResponse.redirect(`${urlSite()}/ia?erreur=lien`);
    await creerSession(abo);
    return NextResponse.redirect(`${urlSite()}/ia`);
  } catch {
    return NextResponse.redirect(`${urlSite()}/ia?erreur=lien`);
  }
}
