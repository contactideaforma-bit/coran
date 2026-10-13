import { NextResponse } from "next/server";
import { QUOTA_PAR_JOUR, abonnementActif, lireSession, questionsPosees } from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Où en est l'utilisateur : connecté ? abonnement actif ? questions restantes ? */
export async function GET() {
  try {
    const s = await lireSession();
    if (!s) return NextResponse.json({ connecte: false });
    const actif = await abonnementActif(s.abonnement);
    const posees = actif ? await questionsPosees(s.email) : 0;
    return NextResponse.json({
      connecte: true,
      email: s.email,
      actif,
      restant: Math.max(0, QUOTA_PAR_JOUR - posees),
      quota: QUOTA_PAR_JOUR,
    });
  } catch {
    return NextResponse.json({ connecte: false });
  }
}
