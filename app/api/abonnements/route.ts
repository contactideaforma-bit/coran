import { createHash } from "crypto";
import { redis } from "@/lib/serveur/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Abonnements aux notifications push de prière.
 * Stockage : Upstash Redis — clé "abo:<hash endpoint>" + index "abos". */

const cleDe = (endpoint: string) =>
  "abo:" + createHash("sha256").update(endpoint).digest("hex").slice(0, 32);

interface CorpsAbonnement {
  sub?: {
    endpoint?: string;
    keys?: { p256dh?: string; auth?: string };
  };
  ville?: string;
  pays?: string;
  methode?: number;
}

export async function POST(req: Request) {
  let corps: CorpsAbonnement;
  try {
    corps = await req.json();
  } catch {
    return Response.json({ erreur: "JSON invalide" }, { status: 400 });
  }
  const { sub, ville, pays, methode } = corps;
  if (
    !sub?.endpoint ||
    !sub.keys?.p256dh ||
    !sub.keys?.auth ||
    typeof ville !== "string" ||
    !ville.trim() ||
    typeof pays !== "string" ||
    typeof methode !== "number"
  ) {
    return Response.json({ erreur: "Champs manquants" }, { status: 400 });
  }

  const cle = cleDe(sub.endpoint);
  await redis(
    "set",
    cle,
    JSON.stringify({
      sub: { endpoint: sub.endpoint, keys: sub.keys },
      ville: ville.trim().slice(0, 80),
      pays: pays.trim().slice(0, 80) || "France",
      methode,
    })
  );
  await redis("sadd", "abos", cle);
  return Response.json({ ok: true });
}

export async function DELETE(req: Request) {
  let corps: { endpoint?: string };
  try {
    corps = await req.json();
  } catch {
    return Response.json({ erreur: "JSON invalide" }, { status: 400 });
  }
  if (!corps.endpoint) {
    return Response.json({ erreur: "endpoint manquant" }, { status: 400 });
  }
  const cle = cleDe(corps.endpoint);
  await redis("del", cle);
  await redis("srem", "abos", cle);
  return Response.json({ ok: true });
}
