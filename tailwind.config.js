/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "ink" — neutro grafite frio, usado no CHROME da interface
        // (cards, bordas, fundos de tela). Evita que tudo fique azulado.
        ink: {
          950: "#111318",
          900: "#191c22",
          800: "#23262e",
          700: "#31353f",
          600: "#454a56",
        },
        // "night" — reservado só pra cena ilustrada da sala (luz noturna azulada)
        night: {
          950: "#0d1b2a",
          900: "#13293d",
          800: "#1b3a56",
          700: "#25506f",
        },
        mist: {
          100: "#eef1f4",
          200: "#d6dbe1",
          300: "#a9b0ba",
        },
        sofa: {
          DEFAULT: "#22405c",
          shadow: "#152c40",
          light: "#2f5578",
        },
        warmglow: "#e8c9a8",
        clay: "#c97b5e", // acento primário — terracota
        sage: "#7c9880", // acento secundário — verde frio acinzentado
        dusk: "#5c7f8a", // acento terciário — petróleo/teal frio
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(10, 12, 16, 0.45)",
      },
    },
  },
  plugins: [],
};
