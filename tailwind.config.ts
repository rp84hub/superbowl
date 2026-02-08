import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Seahawks: Navy Blue & Action Green
        seahawks: {
          navy: "#002244",
          green: "#69BE28",
          "green-light": "#7dd33d",
        },
        // Patriots: Navy, Red, Silver
        patriots: {
          navy: "#0D2240",
          red: "#C60C30",
          silver: "#B0B7BC",
        },
        superbowl: {
          dark: "#0a0e17",
          gold: "#C5B358",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
