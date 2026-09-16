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
        background: "var(--background)",
        foreground: "var(--foreground)",
        calmie: {
          yellow: "#ffe17c",
          pink: "#ff6b8b",
          dark: "#171e19",
          sage: "#b7c6c2",
          cream: "#fbf9f4",
          soft: "#eef2ef",
          coral: "#ff5a36",
          lime: "#bef264",
          blue: "#38bdf8"
        }
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
        'brutal-hover': '1px 1px 0px 0px #000000',
        'brutal-pink': '4px 4px 0px 0px #ff6b8b',
        'brutal-yellow': '4px 4px 0px 0px #ffe17c',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};
export default config;
