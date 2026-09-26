import GuidePasAPas from "@/components/GuidePasAPas";
import { Boussole } from "@/components/Icones";
import { GUIDE_ISTIKHARA } from "@/data/guides";

export default function Istikhara() {
  return (
    <GuidePasAPas
      guide={GUIDE_ISTIKHARA}
      retour={{ href: "/invocations", libelle: "Invocations" }}
      icone={<Boussole taille={22} />}
    />
  );
}
