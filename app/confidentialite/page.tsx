import type { Metadata } from "next";
import Link from "next/link";
import Entete from "@/components/Entete";

export const metadata: Metadata = {
  title: "Politique de confidentialité — My Easy Coran",
  description:
    "Quelles données My Easy Coran utilise, pourquoi, et comment les supprimer.",
};

const MAJ = "13 octobre 2026";

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="card mt-4 rounded-3xl p-5 shadow-soft">
      <h2 className="text-lg font-extrabold" style={{ color: "var(--accent-fort)" }}>
        {titre}
      </h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed" style={{ textAlign: "justify" }}>
        {children}
      </div>
    </section>
  );
}

export default function PageConfidentialite() {
  return (
    <main className="mx-auto max-w-2xl px-4 pb-16 pt-3">
      <Entete />
      <h1 className="mt-6 text-2xl font-extrabold">Politique de confidentialité</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Dernière mise à jour : {MAJ}
      </p>

      <Section titre="En bref">
        <p>
          My Easy Coran fonctionne sans compte et sans publicité. Tes préférences
          et ta progression restent sur ton appareil. Aucune donnée n&apos;est
          vendue ni partagée à des fins commerciales.
        </p>
      </Section>

      <Section titre="Qui est responsable">
        <p>
          L&apos;application est éditée par IDEAFORMA (France). Pour toute
          question ou demande concernant tes données :{" "}
          <a className="underline" href="mailto:contact@ideaforma.fr">
            contact@ideaforma.fr
          </a>
          .
        </p>
      </Section>

      <Section titre="Données stockées sur ton appareil">
        <p>
          Préférences d&apos;affichage (thème, couleurs, récitateur, phonétique),
          marque-page, progression des leçons et des guides, favoris, records des
          jeux, ville choisie pour les horaires de prière. Ces informations sont
          enregistrées uniquement dans la mémoire de l&apos;application sur ton
          téléphone et sont effacées si tu désinstalles l&apos;appli ou vides ses
          données.
        </p>
      </Section>

      <Section titre="Données envoyées à des services tiers">
        <p>
          Pour fonctionner, l&apos;application interroge des services externes :
          le texte du Coran, les traductions et l&apos;audio proviennent de
          quran.com, QuranWBW et everyayah.com ; les horaires de prière sont
          calculés par AlAdhan à partir de la ville que tu as saisie (jamais ta
          position GPS). Ces services reçoivent uniquement les informations
          techniques nécessaires à la requête (adresse IP, ville pour les
          horaires).
        </p>
        <p>
          Des statistiques d&apos;audience anonymes (pages vues, type
          d&apos;appareil) sont collectées via Vercel Analytics, sans cookie ni
          identifiant personnel.
        </p>
      </Section>

      <Section titre="Notifications (facultatif)">
        <p>
          Si tu actives les rappels de prière ou de lecture, un identifiant
          technique de notification, ta ville, ta méthode de calcul et tes
          réglages de rappel sont enregistrés sur notre serveur afin de
          t&apos;envoyer les notifications aux bonnes heures. Ces données sont
          supprimées dès que tu désactives les notifications dans l&apos;appli,
          ou sur simple demande par e-mail.
        </p>
      </Section>

      <Section titre="Soutien et abonnement (Stripe)">
        <p>
          Le soutien libre et l&apos;abonnement à l&apos;assistant IA sont réglés sur une page de
          paiement Stripe : nous ne voyons ni ne conservons tes données bancaires. Stripe nous
          transmet uniquement ton adresse e-mail et l&apos;état de l&apos;abonnement, qui servent à
          t&apos;ouvrir l&apos;accès à l&apos;assistant et à t&apos;envoyer, à ta demande, un lien de
          connexion sur un autre appareil. Tu peux résilier à tout moment depuis la page de
          l&apos;assistant (« Gérer mon abonnement »).
        </p>
      </Section>

      <Section titre="Assistant IA">
        <p>
          Les questions posées à l&apos;assistant sont transmises au fournisseur du modèle
          (Anthropic) pour produire la réponse ; elles ne sont pas utilisées pour entraîner le
          modèle et ne sont pas associées à ton identité. Nous ne conservons pas le contenu des
          questions sur nos serveurs : seul un compteur quotidien (nombre de questions) est tenu
          pour appliquer la limite d&apos;usage. L&apos;historique affiché dans l&apos;appli reste
          sur ton appareil. Les réponses sont générées automatiquement et ne constituent pas une
          fatwa.
        </p>
      </Section>

      <Section titre="Tes droits">
        <p>
          Conformément au RGPD, tu peux demander l&apos;accès, la rectification
          ou la suppression des données qui te concernent en écrivant à{" "}
          <a className="underline" href="mailto:contact@ideaforma.fr">
            contact@ideaforma.fr
          </a>
          . L&apos;application est destinée à un public de tous âges et ne
          collecte sciemment aucune donnée permettant d&apos;identifier un
          enfant.
        </p>
      </Section>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </main>
  );
}
