import Link from "next/link";
import Lecteur from "@/components/Lecteur";
import Entete from "@/components/Entete";

export default function PageSourate({ params }: { params: { n: string } }) {
  const n = Number(params.n);

  if (Number.isInteger(n) && n >= 1 && n <= 114) {
    return <Lecteur n={n} />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />
      <div className="card mt-10 rounded-3xl p-8 text-center shadow-soft">
        <p className="text-4xl">🤔</p>
        <h2 className="mt-3 text-xl font-extrabold">
          Cette sourate n&apos;existe pas
        </h2>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Vérifie le numéro de la sourate (1 à 114).
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
