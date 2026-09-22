/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10203A",      // fundo principal, texto sobre papel
        paper: "#F6F3EC",    // fundo claro, "papel" de balanço
        ledger: "#D8D2C0",   // linhas divisórias, tipo régua de contabilidade
        registro: "#2F6B4F", // valores positivos / crescimento
        alerta: "#B5762A",   // valores negativos / atenção
        aco: "#4A6B8A",      // acento secundário, links, foco
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
