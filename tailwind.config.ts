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
        background: "var(--background)",
        foreground: "var(--foreground)",
        indigo: {
          DEFAULT: "#2d3a8c",
        },
        sand: {
          DEFAULT: "#f7f5f0",
        },
        warm: {
          DEFAULT: "#e8a849",
        },
        dark: {
          DEFAULT: "#1a1a2e",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        control: "10px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        modal: "0 4px 16px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
