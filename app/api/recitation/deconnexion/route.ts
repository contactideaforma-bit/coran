import { NextResponse } from "next/server";
import { supprimerSessionRecit } from "@/lib/recitation-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await supprimerSessionRecit();
  return NextResponse.json({ ok: true });
}
