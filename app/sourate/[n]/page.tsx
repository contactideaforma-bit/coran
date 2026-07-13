import Link from "next/link";
import Lecteur from "@/components/Lecteur";
import Entete from "@/components/Entete";
import { SOURATES } from "@/data/sourates";

export default function PageSourate({ params }: { params: { n: string } }) {
  const n = Number(params.n);
  const sourate = SOURATES.find((s) => s.n === n);

  if (sourate?.disponible) {
    return <Lecteur />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />
      <div className="card mt-10 rounded-3xl p-8 text-center shadow-soft">
        <p className="text-4xl">🚧</p>
        <h2 className="mt-3 text-xl font-extrabold">
          {sourate
            ? `${sourate.nom} arrive bientôt !`
            : "Cette sourate n'existe pas"}
        </h2>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          {sourate
            ? "L'annotation tajwid de cette sourate est en préparation."
            : "Vérifie le numéro de la sourate (1 à 114)."}
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full px-6 py-2 font-bold text-white transition active:scale-95"
          style={{ backgroundColor: "var(--accent)" }}
        >
          ← Retour aux sourates
        </Link>
      </div>
    </div>
  );
}
