import { NextResponse } from "next/server";
import { SOURATES } from "@/data/sourates";
import {
  DUREE_MAX_SECONDES,
  ESSAIS_GRATUITS,
  ajouterHistorique,
  comparer,
  consommerEssai,
  creerIdentifiantAppareil,
  debiter,
  emailSessionRecit,
  essaisConsommes,
  solde,
  texteSourate,
  transcrire,
} from "@/lib/recitation-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** POST multipart : audio (fichier), sourate, de, a → comparaison mot à mot. */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ erreur: "Requête invalide" }, { status: 400 });
  }
  const audio = form.get("audio");
  const sourate = Number(form.get("sourate"));
  const de = Number(form.get("de"));
  const a = Number(form.get("a") ?? de);
  const meta = SOURATES.find((s) => s.n === sourate);
  if (!(audio instanceof Blob) || !meta || de < 1 || a < de || a > meta.versets) {
    return NextResponse.json({ erreur: "Paramètres invalides" }, { status: 400 });
  }
  if (audio.size > 12 * 1024 * 1024) {
    return NextResponse.json({ erreur: "Enregistrement trop long" }, { status: 413 });
  }

  // Qui paie ? Solde de l'utilisateur connecté, sinon essai offert
  const email = await emailSessionRecit();
  let appareil: string | null = null;
  if (email) {
    if ((await solde(email)) <= 0) {
      return NextResponse.json({ erreur: "solde", message: "Ton solde est épuisé." }, { status: 402 });
    }
  } else {
    appareil = creerIdentifiantAppareil();
    if ((await essaisConsommes(appareil)) >= ESSAIS_GRATUITS) {
      return NextResponse.json(
        { erreur: "essais", message: "Tes essais offerts sont utilisés : recharge des crédits pour continuer." },
        { status: 402 }
      );
    }
  }

  try {
    const nom = (audio as File).name || "recitation.webm";
    const [{ texte, duree }, versets] = await Promise.all([transcrire(audio, nom), texteSourate(sourate)]);
    const attendu = versets.slice(de - 1, a).join(" ");
    const comparaison = comparer(attendu, texte);
    const secondes = Math.min(DUREE_MAX_SECONDES + 5, Math.max(1, Math.ceil(duree || 1)));

    let reste: number | null = null;
    let essaisRestants: number | null = null;
    if (email) {
      reste = await debiter(email, secondes);
      await ajouterHistorique(email, { quand: Date.now(), sourate, de, a, score: comparaison.score });
    } else if (appareil) {
      essaisRestants = Math.max(0, ESSAIS_GRATUITS - (await consommerEssai(appareil)));
    }
    return NextResponse.json({
      ...comparaison,
      attendu,
      transcription: texte,
      secondes,
      reste,
      essaisRestants,
    });
  } catch (e) {
    return NextResponse.json({ erreur: "analyse", message: (e as Error).message }, { status: 500 });
  }
}
