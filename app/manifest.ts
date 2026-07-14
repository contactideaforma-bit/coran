import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Easy Muslim",
    short_name: "Easy Muslim",
    description:
      "Coran avec tajwid en couleur, hadith du jour, horaires de prière, invocations, Nourania et calendrier religieux — en français.",
    start_url: "/",
    display: "standalone",
    background_color: "#fefae7",
    theme_color: "#c9a24b",
    lang: "fr",
    icons: [
      {
        src: "/icone-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icone-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icone-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icone-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
