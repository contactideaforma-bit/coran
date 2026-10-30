import Link from "next/link";
import type { ReactNode } from "react";

/* En-tête de rubrique « éditorial » : bandeau teinté, surtitre, grand
   titre, texte court, calligraphie en filigrane et illustration 3D qui
   déborde. Utilisé en haut de chaque page de l'appli. */

interface Props {
  surtitre: string; // ex. « Au quotidien »
  titre: string; // ex. « Calendrier religieux »
  texte?: string;
  teinte?: string; // couleur de la rubrique (défaut : accent)
  filigrane?: string; // mot arabe décoratif, ex. « التقويم »
  image?: string; // /icones/xxx.webp
  retour?: { href: string; libelle: string };
  actions?: ReactNode; // boutons à droite du lien retour
  enfants?: ReactNode; // contenu additionnel sous le texte
}

export default function EnTeteRubrique({
  surtitre,
  titre,
  texte,
  teinte,
  filigrane,
  image,
  retour = { href: "/", libelle: "Accueil" },
  actions,
  enfants,
}: Props) {
  return (
    <section className="hero" style={teinte ? ({ "--teinte": teinte } as React.CSSProperties) : undefined}>
      {filigrane && (
        <span className="hero-filigrane font-amiri" aria-hidden>
          {filigrane}
        </span>
      )}
      <div className="relative flex items-center justify-between gap-3">
        <Link href={retour.href} className="pilule-claire text-xs">
          ← {retour.libelle}
        </Link>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="relative mt-5" style={{ paddingRight: image ? "6rem" : undefined }}>
        <p className="hero-surtitre">{surtitre}</p>
        <h1 className="hero-titre">{titre}</h1>
        {texte && <p className="hero-texte">{texte}</p>}
        {enfants}
      </div>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="hero-image" draggable={false} />
      )}
    </section>
  );
}
