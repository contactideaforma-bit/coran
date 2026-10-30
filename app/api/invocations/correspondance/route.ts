import { NextResponse } from "next/server";
import { correspondanceAudio } from "@/lib/invocations-audio";

export const runtime = "nodejs";

/** Quelles invocations ont un enregistrement audio (Hisn al-Muslim), et lequel. */
export async function GET() {
  try {
    const table = await correspondanceAudio();
    return NextResponse.json(table, {
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    });
  } catch {
    return NextResponse.json({}, { status: 503 });
  }
}
