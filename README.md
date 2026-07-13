# Coran Tajwid 📖

Application francophone pour lire le Coran avec les règles de tajwid en couleur.

## Lancer l'appli

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

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
