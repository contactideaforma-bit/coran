import { NextResponse } from "next/server";
import {
  QUOTA_PAR_JOUR,
  abonnementActif,
  compterQuestion,
  interrogerModele,
  lireSession,
  type MessageIa,
} from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Pose une question : { question, historique?: [{role, content}] } */
export async function POST(req: Request) {
  try {
    const s = await lireSession();
    if (!s) return NextResponse.json({ ok: false, code: "non_connecte" }, { status: 401 });
    if (!(await abonnementActif(s.abonnement))) {
      return NextResponse.json({ ok: false, code: "inactif" }, { status: 402 });
    }

    const corps = (await req.json()) as { question?: string; historique?: MessageIa[] };
    const question = (corps.question ?? "").trim().slice(0, 1500);
    if (question.length < 3) return NextResponse.json({ ok: false, code: "vide" }, { status: 400 });

    const n = await compterQuestion(s.email);
    if (n > QUOTA_PAR_JOUR) {
      return NextResponse.json({ ok: false, code: "quota", quota: QUOTA_PAR_JOUR }, { status: 429 });
    }

    // Contexte : les 6 derniers échanges, texte seul
    const historique = (corps.historique ?? [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    const messages: MessageIa[] = [...historique, { role: "user", content: question }];

    const reponse = await interrogerModele(messages);
    return NextResponse.json({ ok: true, reponse, restant: Math.max(0, QUOTA_PAR_JOUR - n) });
  } catch (e) {
    console.error("[ia]", e);
    return NextResponse.json({ ok: false, code: "erreur" }, { status: 500 });
  }
}
