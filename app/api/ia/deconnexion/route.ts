import { NextResponse } from "next/server";
import { supprimerSession } from "@/lib/ia-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await supprimerSession();
  return NextResponse.json({ ok: true });
}
