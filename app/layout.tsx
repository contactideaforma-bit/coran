import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coran Tajwid — Lire et apprendre",
  description:
    "Application francophone pour lire le Coran avec les règles de tajwid en couleur.",
};

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
      </head>
      <body className="font-ui min-h-screen antialiased">{children}</body>
    </html>
  );
}
