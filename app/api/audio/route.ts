import { NextResponse } from "next/server";

export const runtime = "nodejs";

/* Relais audio : sert les fichiers des récitateurs (everyayah.com) et le
   mot à mot (verses.quran.com) avec les en-têtes CORS nécessaires au
   Web Audio (lecture continue sans coupure). Les fichiers ne changent
   jamais : cache d'un an côté navigateur et CDN. */

const HOTES_AUTORISES = ["everyayah.com", "verses.quran.com"];

export async function GET(req: Request) {
  const u = new URL(req.url).searchParams.get("u");
  if (!u) return new NextResponse("Paramètre u manquant", { status: 400 });
  let cible: URL;
  try {
    cible = new URL(u);
  } catch {
    return new NextResponse("URL invalide", { status: 400 });
  }
  if (cible.protocol !== "https:" || !HOTES_AUTORISES.includes(cible.hostname)) {
    return new NextResponse("Hôte non autorisé", { status: 403 });
  }
  if (!cible.pathname.endsWith(".mp3")) {
    return new NextResponse("Fichier non autorisé", { status: 403 });
  }
  const res = await fetch(cible.toString(), {
    headers: { "User-Agent": "MyEasyCoran/1.0 (+https://www.myeasycoran.fr)" },
    cache: "force-cache",
  });
  if (!res.ok || !res.body) {
    return new NextResponse("Audio introuvable", { status: res.status || 502 });
  }
  return new NextResponse(res.body, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
