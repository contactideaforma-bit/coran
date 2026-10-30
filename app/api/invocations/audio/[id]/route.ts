import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Relais des enregistrements Hisn al-Muslim (servis en http par la source,
 *  donc bloqués en direct depuis une page https). */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 1 || id > 1000) {
    return new NextResponse("Identifiant invalide", { status: 400 });
  }
  const res = await fetch(`https://www.hisnmuslim.com/audio/ar/${id}.mp3`, {
    cache: "force-cache",
  }).catch(() => null);
  const source =
    res && res.ok
      ? res
      : await fetch(`http://www.hisnmuslim.com/audio/ar/${id}.mp3`).catch(() => null);
  if (!source || !source.ok || !source.body) {
    return new NextResponse("Audio introuvable", { status: 404 });
  }
  return new NextResponse(source.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
