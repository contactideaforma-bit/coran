import { NextResponse } from "next/server";
import { lienPortail, lireSession } from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lien vers le portail Stripe (gérer / résilier l'abonnement). */
export async function POST() {
  try {
    const s = await lireSession();
    if (!s) return NextResponse.json({ ok: false }, { status: 401 });
    return NextResponse.json({ ok: true, url: await lienPortail(s.client) });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
