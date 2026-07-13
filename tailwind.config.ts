import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#faf6ef",
        ink: "#2d2a26",
        gold: "#c9a24b",
        sage: "#7a9d7e",
      },
      fontFamily: {
        ui: ["'Nunito'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(80, 60, 20, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
