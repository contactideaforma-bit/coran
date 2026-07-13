# Coran Tajwid 📖

Application francophone pour lire le Coran avec les règles de tajwid en couleur.

## Lancer l'appli

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Fonctionnalités (V1)

- Sourate Al-Fâtiha avec règles tajwid colorées (annotation de démo, à faire valider par un spécialiste)
- Toucher une lettre colorée → fiche explicative de la règle
- Bouton flottant « 🎨 Règles » → légende complète des couleurs
- 4 tailles de texte (S / M / L / XL)
- 3 polices arabes : Amiri, Scheherazade New, Noto Naskh Arabic
- Mode clair (fond texturé papier) / mode sombre, préférences sauvegardées
- Audio : toucher un mot → sa prononciation (mot à mot Quran.com) ; bouton ▶ Verset → récitation complète par Mishary Rashid Al-Afasy (everyayah.com)

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS
