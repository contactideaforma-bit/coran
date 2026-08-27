import { NextResponse } from "next/server";
import {
  enregistrerAbonne,
  idDepuisEndpoint,
  supprimerAbonne,
  trouverParEndpoint,
} from "@/lib/push-serveur";
import type { Abonne } from "@/lib/rappels";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Enregistre ou met à jour un appareil (aussi appelé par le service worker
 *  quand le navigateur renouvelle l'abonnement). */
export async function POST(req: Request) {
  try {
    const corps = await req.json();

    if (corps.renouvellement) {
      const endpoint = corps.abonnement?.endpoint;
      if (!endpoint) return NextResponse.json({ ok: false }, { status: 400 });
      const ancien = corps.ancienEndpoint
        ? await trouverParEndpoint(corps.ancienEndpoint)
        : undefined;
      if (!ancien) return NextResponse.json({ ok: false, inconnu: true });
      await supprimerAbonne(ancien.id);
      await enregistrerAbonne({
        ...ancien,
        id: await idDepuisEndpoint(endpoint),
        abonnement: corps.abonnement,
        maj: Date.now(),
      });
      return NextResponse.json({ ok: true });
    }

    const a = corps as Abonne;
    if (!a?.abonnement?.endpoint || !a.notifs) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    // L'identifiant est recalculé côté serveur : impossible d'écraser un autre appareil.
    a.id = await idDepuisEndpoint(a.abonnement.endpoint);
    a.maj = Date.now();
    await enregistrerAbonne(a);
    return NextResponse.json({ ok: true, id: a.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, erreur: (e as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (typeof id === "string" && id) await supprimerAbonne(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, erreur: (e as Error).message },
      { status: 500 }
    );
  }
}
