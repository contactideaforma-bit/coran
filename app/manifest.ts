import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coran Tajwid",
    short_name: "Coran",
    description:
      "Lire le Coran avec les règles de tajwid en couleur, la prononciation mot à mot et la récitation.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ef",
    theme_color: "#c9a24b",
    lang: "fr",
    icons: [
      {
        src: "/icone.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
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
    ],
  };
}
