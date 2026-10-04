import GuidePasAPas from "@/components/GuidePasAPas";
import { Bouclier } from "@/components/Icones";
import { GUIDE_ROQYA } from "@/data/guides";

export default function Roqya() {
  return (
    <GuidePasAPas
      guide={GUIDE_ROQYA}
      retour={{ href: "/invocations", libelle: "Invocations" }}
      icone={<Bouclier taille={22} />}
    />
  );
}
