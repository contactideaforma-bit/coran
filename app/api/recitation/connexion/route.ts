import { NextResponse } from "next/server";
import { consommerLien, envoyerLienConnexion } from "@/lib/ia-serveur";
import { creerSessionRecit, urlSite } from "@/lib/recitation-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST { email } : envoie un lien de connexion pour retrouver ses crédits sur un autre appareil. */
export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const e = (email ?? "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      return NextResponse.json({ ok: false, message: "Adresse e-mail invalide" }, { status: 400 });
    }
    await envoyerLienConnexion(e, {
      route: "/api/recitation/connexion",
      sujet: "Tes crédits Récitation — My Easy Coran",
      bouton: "Ouvrir la récitation",
      service: "la récitation",
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, message: (e as Error).message }, { status: 500 });
  }
}

/** GET ?token=… : lien reçu par e-mail. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const email = await consommerLien(token).catch(() => null);
  if (!email) return NextResponse.redirect(`${urlSite()}/recitation?erreur=lien`);
  await creerSessionRecit(email);
  return NextResponse.redirect(`${urlSite()}/recitation?connecte=1`);
}
