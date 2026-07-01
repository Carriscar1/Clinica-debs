/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta fria e aconchegante — azuis profundos + neutros quentes
        night: {
          950: "#0d1b2a",
          900: "#13293d",
          800: "#1b3a56",
          700: "#25506f",
        },
        mist: {
          100: "#eef3f6",
          200: "#dce6ec",
          300: "#c3d4de",
        },
        sofa: {
          DEFAULT: "#22405c", // azul escuro do sofá
          shadow: "#152c40",
          light: "#2f5578",
        },
        warmglow: "#e8c9a8", // luz quente de abajur
        clay: "#c97b5e", // acento terracota aconchegante
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(13, 27, 42, 0.35)",
      },
    },
  },
  plugins: [],
};
