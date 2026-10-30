import { NextResponse } from "next/server";
import { crediterDepuisCheckout, creerSessionRecit, urlSite } from "@/lib/recitation-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Retour de Stripe après l'achat de crédits : /api/recitation/acces?session_id=cs_… */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("session_id") ?? "";
  try {
    const r = /^cs_[A-Za-z0-9_]+$/.test(id) ? await crediterDepuisCheckout(id) : null;
    if (!r) return NextResponse.redirect(`${urlSite()}/recitation?erreur=paiement`);
    await creerSessionRecit(r.email);
    return NextResponse.redirect(`${urlSite()}/recitation?merci=${r.secondes}`);
  } catch {
    return NextResponse.redirect(`${urlSite()}/recitation?erreur=paiement`);
  }
}
