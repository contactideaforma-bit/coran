import { NextResponse } from "next/server";
import {
  QUESTIONS_GRATUITES,
  QUOTA_PAR_JOUR,
  abonnementActif,
  compterQuestion,
  consommerGratuite,
  gratuitesConsommees,
  identifiantAnonyme,
  interrogerModele,
  lireSession,
  type MessageIa,
} from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Pose une question : { question, historique?: [{role, content}] }
 *  Abonné : quota journalier. Sans abonnement : QUESTIONS_GRATUITES par appareil. */
export async function POST(req: Request) {
  try {
    const corps = (await req.json()) as { question?: string; historique?: MessageIa[] };
    const question = (corps.question ?? "").trim().slice(0, 1500);
    if (question.length < 3) return NextResponse.json({ ok: false, code: "vide" }, { status: 400 });

    const s = await lireSession();
    let restant: number;
    let gratuit = false;

    if (s && (await abonnementActif(s.abonnement))) {
      const n = await compterQuestion(s.email);
      if (n > QUOTA_PAR_JOUR) {
        return NextResponse.json({ ok: false, code: "quota", quota: QUOTA_PAR_JOUR }, { status: 429 });
      }
      restant = Math.max(0, QUOTA_PAR_JOUR - n);
    } else if (s) {
      return NextResponse.json({ ok: false, code: "inactif" }, { status: 402 });
    } else {
      // Sans abonnement : questions offertes, comptées par appareil
      const anonyme = identifiantAnonyme();
      if (!anonyme) return NextResponse.json({ ok: false, code: "gratuit_epuise" }, { status: 402 });
      if ((await gratuitesConsommees(anonyme)) >= QUESTIONS_GRATUITES) {
        return NextResponse.json({ ok: false, code: "gratuit_epuise" }, { status: 402 });
      }
      const n = await consommerGratuite(anonyme);
      restant = Math.max(0, QUESTIONS_GRATUITES - n);
      gratuit = true;
    }

    // Contexte : les 6 derniers échanges, texte seul
    const historique = (corps.historique ?? [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    const messages: MessageIa[] = [...historique, { role: "user", content: question }];

    const reponse = await interrogerModele(messages);
    return NextResponse.json({ ok: true, reponse, restant, gratuit });
  } catch (e) {
    console.error("[ia]", e);
    return NextResponse.json({ ok: false, code: "erreur" }, { status: 500 });
  }
}
