# Coran Tajwid 📖

Application francophone pour lire le Coran avec les règles de tajwid en couleur.

## Lancer l'appli

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Fonctionnalités (V2)

- Page d'accueil : liste des 114 sourates avec recherche (Al-Fâtiha disponible, autres « bientôt »)
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
