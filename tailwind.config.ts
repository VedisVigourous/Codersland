import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        borderland: {
          bg: "#050508",
          card: "#0d0c13",
          cardLight: "#161522",
          red: "#ff113a",
          darkRed: "#8b0000",
          crimson: "#d6001c",
          parchment: "#f4ede0",
          parchmentDark: "#e5dcbe",
          gold: "#c5a059",
          foil: "#e8d8b8",
        },
      },
      fontFamily: {
        gothic: ["var(--font-baroque)", "Pirata One", "UnifrakturCook", "Cinzel Decorative", "serif"],
        woodtype: ["var(--font-sheepman)", "Rye", "Bebas Neue", "Oswald", "sans-serif"],
        techno: ["var(--font-techno)", "Black Ops One", "Impact", "sans-serif"],
        body: ["var(--font-body)", "Cinzel", "Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        laser: "0 0 25px rgba(255, 17, 58, 0.7), 0 0 50px rgba(214, 0, 28, 0.3)",
        card: "0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 17, 58, 0.25)",
        cardHover: "0 25px 50px -12px rgba(255, 17, 58, 0.4), 0 0 30px rgba(255, 17, 58, 0.5)",
        foil: "0 0 15px rgba(197, 160, 89, 0.4)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        laserPulse: {
          "0%, 100%": { opacity: "0.85", transform: "scaleY(1)" },
          "50%": { opacity: "0.35", transform: "scaleY(0.97)" },
        },
        cardFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        glitter: {
          "0%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "0.9", transform: "scale(1.2)" },
          "100%": { opacity: "0.2", transform: "scale(0.8)" },
        },
      },
      animation: {
        shimmer: "shimmer 4s infinite linear",
        laserPulse: "laserPulse 3s infinite ease-in-out",
        cardFloat: "cardFloat 5s infinite ease-in-out",
        glitter: "glitter 2.5s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
