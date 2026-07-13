# Coran Tajwid 📖

Application francophone complète : Coran avec tajwid en couleur, hadith du jour, horaires de prière, invocations, apprentissage de la lecture (Nourania) et calendrier des événements religieux.

## Fonctionnalités (V6 — refonte « compagnon »)

- Accueil : hadith du jour (24 hadiths authentiques en rotation), date hégirienne, prochain événement religieux, reprise de lecture, accès aux 5 modules
- 📖 Coran : tout l'existant, déplacé sur /coran
- 🔤 Nourania : parcours complet en 8 leçons interactives avec audio et suivi de progression — alphabet, lettres liées, voyelles (harakât), tanwîn, prolongations (madd), soukoun, shadda, premiers mots du Coran
- 🤲 Invocations : douas authentiques (Hisn al-Muslim) avec arabe, translittération, traduction et source
- 🕌 Horaires de prière : par ville (API AlAdhan), méthode de calcul au choix (UOIF 12°, LIM 18°, ISNA…), prochaine prière mise en avant
- 📅 Calendrier religieux : Ramadan, Aïds, Arafat, Achoura, jours blancs… avec dates hégiriennes calculées (Umm al-Qura), conseils et récompenses sourcées
- 🎮 Jeux (10 questions par partie, records par appareil) : jeu des lettres à l'oreille avec 3 niveaux de difficulté (facile 3 choix distincts / moyen 4 choix / difficile 6 choix avec lettres ressemblantes), quiz de connaissances (20 questions rédigées)
- Interface 100 % icônes SVG (fin des emojis), invocations en accordéons, lettres Nourania prononcées à la voix

## Lancer l'appli

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Fonctionnalités (V5)

- Traduction française mot à mot : toucher un mot affiche son sens (source : QuranWBW, Dr. Usama Nonnenmacher) à côté de sa prononciation
- Audio mot à mot fiabilisé : numérotation officielle respectée même avec les signes de pause (ۖ ۗ ۞)
- Icône de lecture redessinée (haut-parleur blanc sur fond accent), lisibilité vérifiée en clair et sombre

## Fonctionnalités (V4)

- Lecture de la sourate entière : les versets s'enchaînent avec suivi visuel et défilement automatique
- Cache hors-ligne (service worker) : texte, traduction et polices disponibles sans connexion après une première visite (l'audio nécessite une connexion)
- Marque-page 🔖 : pose-le sur un verset, reprends depuis l'accueil (propre à chaque appareil)
- Pagination par juz' pour les longues sourates
- Mise en page mobile corrigée : mots compacts, traduction sous le texte arabe

## Fonctionnalités (V3)

- Les 114 sourates complètes : texte arabe avec balisage tajwid officiel (API Quran.com, celui des mushafs colorés imprimés) + traduction française de Muhammad Hamidullah, chargés à l'ouverture
- 10 règles tajwid colorées : ghunna, madd (3 degrés), qalqala, ikhfa, idgham, iqlab, lam solaire, lettres muettes
- Navigation sourate précédente/suivante

## Fonctionnalités (V2)

- Page d'accueil : liste des 114 sourates avec recherche
- Personnalisation ✨ : thème clair/sombre, 6 couleurs de fond, 5 couleurs d'accent, tailles et polices — réglages enregistrés sur l'appareil uniquement (localStorage, aucun compte)
- Installable sur téléphone (PWA : manifest + icônes)

## Fonctionnalités (V1)

- Sourate Al-Fâtiha avec règles tajwid colorées (annotation de démo, à faire valider par un spécialiste)
- Toucher une lettre colorée → fiche explicative de la règle
- Bouton flottant « 🎨 Règles » → légende complète des couleurs
- 4 tailles de texte (S / M / L / XL)
- 3 polices arabes : Amiri, Scheherazade New, Noto Naskh Arabic
- Mode clair (fond texturé papier) / mode sombre, préférences sauvegardées
- Audio : toucher un mot → sa prononciation (mot à mot Quran.com) ; bouton ▶ Verset → récitation complète par le récitateur choisi (everyayah.com)
- 6 récitateurs au choix : Al-Husary (défaut), Abdul Basit, El-Minshawi, As-Sudais, Ash-Shuraym, Al-Ghamdi

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS
