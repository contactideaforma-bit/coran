import { NextResponse } from "next/server";
import { redis } from "@/lib/ia-serveur";
import {
  COUT_SECONDE_CENTIMES,
  ESSAIS_GRATUITS,
  FRAIS_STRIPE,
  PRIX_PACK_CENTIMES,
  DUREE_MAX_SECONDES,
  emailSessionRecit,
  essaisConsommes,
  identifiantAppareil,
  lireHistorique,
  secondesPourMontant,
  solde,
} from "@/lib/recitation-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Où en est l'utilisateur : solde de secondes, essais offerts, tarif détaillé. */
export async function GET() {
  const tarif = {
    prixPack: PRIX_PACK_CENTIMES,
    ...secondesPourMontant(PRIX_PACK_CENTIMES),
    coutMinute: Math.round(COUT_SECONDE_CENTIMES * 60 * 100) / 100, // centimes/min
    fraisPourcent: FRAIS_STRIPE.pourcent,
    fraisFixe: FRAIS_STRIPE.fixeCentimes,
    dureeMax: DUREE_MAX_SECONDES,
    lien: process.env.NEXT_PUBLIC_LIEN_CREDITS_RECITATION ?? "",
  };
  try {
    // Lien créé par /api/recitation/configurer (prioritaire sur la variable d'environnement)
    const lienRedis = await redis<string | null>("GET", "recit:lien").catch(() => null);
    if (lienRedis) tarif.lien = lienRedis;
    const email = await emailSessionRecit();
    if (email) {
      const [secondes, historique] = await Promise.all([solde(email), lireHistorique(email)]);
      return NextResponse.json({ connecte: true, email, secondes, historique, tarif });
    }
    const appareil = identifiantAppareil();
    const consommes = appareil ? await essaisConsommes(appareil) : 0;
    return NextResponse.json({
      connecte: false,
      essaisRestants: Math.max(0, ESSAIS_GRATUITS - consommes),
      essaisTotal: ESSAIS_GRATUITS,
      tarif,
    });
  } catch {
    return NextResponse.json({ connecte: false, essaisRestants: ESSAIS_GRATUITS, essaisTotal: ESSAIS_GRATUITS, tarif });
  }
}
