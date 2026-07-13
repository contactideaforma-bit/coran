import type { Metadata, Viewport } from "next";
import { PrefsProvider } from "@/lib/prefs";
import EnregistrerSW from "@/components/EnregistrerSW";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coran Tajwid — Ton compagnon du quotidien",
  description:
    "Coran avec tajwid en couleur, hadith du jour, horaires de prière, invocations, apprentissage Nourania et calendrier des événements religieux — en français.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Coran Tajwid",
  },
};

export const viewport: Viewport = {
  themeColor: "#c9a24b",
};

// Applique le thème sauvegardé AVANT le premier rendu (évite le flash)
const scriptTheme = `
try {
  var p = JSON.parse(localStorage.getItem('coran-prefs') || '{}');
  if (p.dark) document.documentElement.classList.add('dark');
  var c = JSON.parse(localStorage.getItem('coran-couleurs') || 'null');
  if (c) {
    var r = document.documentElement.style;
    r.setProperty('--bg', c.bg); r.setProperty('--card', c.card);
    r.setProperty('--border', c.border); r.setProperty('--text', c.text);
    r.setProperty('--muted', c.muted); r.setProperty('--accent', c.accent);
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: scriptTheme }} />
      </head>
      <body className="font-ui min-h-screen antialiased">
        <PrefsProvider>{children}</PrefsProvider>
        <EnregistrerSW />
      </body>
    </html>
  );
}
