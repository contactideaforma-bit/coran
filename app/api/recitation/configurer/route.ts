import { NextResponse } from "next/server";
import { redis, stripe, urlSite } from "@/lib/ia-serveur";
import { PRIX_PACK_CENTIMES } from "@/lib/recitation-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Mise en place (une seule fois) du lien de paiement Stripe des crédits :
 *  GET /api/recitation/configurer   (ou ?cle=<CRON_SECRET>&forcer=1 pour recréer)
 *  Crée le produit, le prix (paiement unique) et le lien, puis le mémorise
 *  dans Redis (recit:lien) — lu par /api/recitation/etat, sans redéploiement. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.CRON_SECRET;
  const autorise = !!secret && url.searchParams.get("cle") === secret;
  try {
    // Sans secret : on renvoie le lien s'il existe déjà, et on ne le crée
    // qu'une seule fois (opération idempotente, sans effet pour un visiteur).
    const existant = await redis<string | null>("GET", "recit:lien");
    if (existant && !(autorise && url.searchParams.get("forcer"))) {
      return NextResponse.json({ ok: true, lien: existant, deja: true });
    }
    // Verrou : une seule création à la fois
    const verrou = await redis<number>("SETNX", "recit:lien:verrou", "1");
    if (verrou !== 1 && !autorise) {
      return NextResponse.json({ ok: false, erreur: "Création déjà en cours" }, { status: 409 });
    }
    await redis("EXPIRE", "recit:lien:verrou", 120);
    const produit = await stripe<{ id: string }>("/products", {
      methode: "POST",
      corps: {
        name: "Crédits Récitation — My Easy Coran",
        description:
          "Temps d'analyse vocale (transcription OpenAI) pour le quiz de récitation. Prix coûtant, sans commission : le montant, frais bancaires déduits, est converti en secondes d'écoute analysée.",
        "metadata[app]": "myeasycoran",
        "metadata[usage]": "recitation",
      },
    });
    const prix = await stripe<{ id: string }>("/prices", {
      methode: "POST",
      corps: {
        product: produit.id,
        currency: "eur",
        unit_amount: String(PRIX_PACK_CENTIMES),
      },
    });
    const lien = await stripe<{ id: string; url: string }>("/payment_links", {
      methode: "POST",
      corps: {
        "line_items[0][price]": prix.id,
        "line_items[0][quantity]": "1",
        "line_items[0][adjustable_quantity][enabled]": "true",
        "line_items[0][adjustable_quantity][minimum]": "1",
        "line_items[0][adjustable_quantity][maximum]": "10",
        "after_completion[type]": "redirect",
        "after_completion[redirect][url]": `${urlSite()}/api/recitation/acces?session_id={CHECKOUT_SESSION_ID}`,
        "metadata[app]": "myeasycoran",
        "metadata[usage]": "recitation",
        "custom_text[submit][message]":
          "Prix coûtant : le montant, frais bancaires déduits, devient du temps d'analyse vocale. Merci de soutenir le projet par ailleurs si tu le souhaites.",
      },
    });
    await redis("SET", "recit:lien", lien.url);
    return NextResponse.json({ ok: true, lien: lien.url, produit: produit.id, prix: prix.id });
  } catch (e) {
    return NextResponse.json({ ok: false, erreur: (e as Error).message }, { status: 500 });
  }
}
