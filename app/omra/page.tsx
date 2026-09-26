import GuidePasAPas from "@/components/GuidePasAPas";
import { KaabaIcone } from "@/components/Icones";
import { GUIDE_OMRA } from "@/data/guides";

export default function Omra() {
  return (
    <GuidePasAPas
      guide={GUIDE_OMRA}
      retour={{ href: "/", libelle: "Accueil" }}
      icone={<KaabaIcone taille={22} />}
    />
  );
}
