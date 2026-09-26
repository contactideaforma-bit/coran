import GuidePasAPas from "@/components/GuidePasAPas";
import { Repeter } from "@/components/Icones";
import { GUIDE_TAWBA } from "@/data/guides";

export default function Tawba() {
  return (
    <GuidePasAPas
      guide={GUIDE_TAWBA}
      retour={{ href: "/invocations", libelle: "Invocations" }}
      icone={<Repeter taille={22} />}
    />
  );
}
