import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d"
        },
        accent: {
          500: "#f59e0b",
          600: "#d97706"
        },
        cream: "#f7f6f0",
        ink: "#101828"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 40, 26, 0.08)",
        card: "0 12px 32px rgba(16, 24, 40, 0.08)"
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem'
      },
      fontFamily: {
        sans: ["var(--font-fredoka)", "Fredoka", "ui-sans-serif", "system-ui", "sans-serif"],
        soft: ["var(--font-nunito)", "Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        "infinite-scroll-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" }
        }
      },
      animation: {
        "infinite-scroll": "infinite-scroll 36s linear infinite",
        "infinite-scroll-reverse": "infinite-scroll-reverse 42s linear infinite"
      },
      backgroundImage: {
        softgrid: "radial-gradient(circle at 20px 20px, rgba(20, 127, 69, 0.08) 1px, transparent 0)",
        hero: "linear-gradient(135deg, rgba(240,253,244,.9) 0%, rgba(255,255,255,.95) 52%, rgba(245,158,11,.15) 100%)"
      }
    }
  },
  plugins: []
};
export default config;
