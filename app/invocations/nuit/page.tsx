import GuidePasAPas from "@/components/GuidePasAPas";
import { LuneEtoile } from "@/components/Icones";
import { GUIDE_NUIT } from "@/data/guides";

export default function PriereNuit() {
  return (
    <GuidePasAPas
      guide={GUIDE_NUIT}
      retour={{ href: "/invocations", libelle: "Invocations" }}
      icone={<LuneEtoile taille={22} />}
    />
  );
}
