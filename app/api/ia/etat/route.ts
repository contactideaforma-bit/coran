import { NextResponse } from "next/server";
import {
  QUESTIONS_GRATUITES,
  QUOTA_PAR_JOUR,
  abonnementActif,
  gratuitesConsommees,
  identifiantAnonyme,
  lireSession,
  questionsPosees,
} from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Où en est l'utilisateur : connecté ? abonnement actif ? questions restantes ?
 *  Sans abonnement : nombre de questions gratuites encore disponibles. */
export async function GET() {
  try {
    const s = await lireSession();
    if (s) {
      const actif = await abonnementActif(s.abonnement);
      const posees = actif ? await questionsPosees(s.email) : 0;
      return NextResponse.json({
        connecte: true,
        email: s.email,
        actif,
        restant: Math.max(0, QUOTA_PAR_JOUR - posees),
        quota: QUOTA_PAR_JOUR,
      });
    }
    const anonyme = identifiantAnonyme();
    const consommees = anonyme ? await gratuitesConsommees(anonyme) : QUESTIONS_GRATUITES;
    return NextResponse.json({
      connecte: false,
      gratuitRestant: Math.max(0, QUESTIONS_GRATUITES - consommees),
      gratuitTotal: QUESTIONS_GRATUITES,
    });
  } catch {
    return NextResponse.json({ connecte: false, gratuitRestant: 0, gratuitTotal: QUESTIONS_GRATUITES });
  }
}
