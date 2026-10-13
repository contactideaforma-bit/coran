import { NextResponse } from "next/server";
import { creerSession, lireSessionCheckout, urlSite } from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Retour de Stripe après l'abonnement : /api/ia/acces?session_id=cs_… */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("session_id") ?? "";
  try {
    const s = /^cs_[A-Za-z0-9_]+$/.test(id) ? await lireSessionCheckout(id) : null;
    if (!s) return NextResponse.redirect(`${urlSite()}/ia?erreur=paiement`);
    await creerSession(s);
    return NextResponse.redirect(`${urlSite()}/ia?bienvenue=1`);
  } catch {
    return NextResponse.redirect(`${urlSite()}/ia?erreur=paiement`);
  }
}
