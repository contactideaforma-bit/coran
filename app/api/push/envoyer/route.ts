import { NextResponse } from "next/server";
import { envoyerRappels } from "@/lib/push-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Appelé chaque minute par un cron externe (cron-job.org) :
 *  GET /api/push/envoyer  avec l'en-tête  Authorization: Bearer <CRON_SECRET>
 *  (ou ?cle=<CRON_SECRET>). */
async function traiter(req: Request) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const fourni =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    url.searchParams.get("cle");
  if (!secret || fourni !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const bilan = await envoyerRappels();
    return NextResponse.json({ ok: true, ...bilan });
  } catch (e) {
    return NextResponse.json(
      { ok: false, erreur: (e as Error).message },
      { status: 500 }
    );
  }
}

export const GET = traiter;
export const POST = traiter;
