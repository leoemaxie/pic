/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-deep": "var(--bg-deep)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        bd: "var(--bd)",
        "bd-strong": "var(--bd-strong)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-subtle": "var(--text-subtle)",
        "text-faint": "var(--text-faint)",
        brand: "var(--brand)",
        "cta-bg": "var(--cta-bg)",
        "cta-fg": "var(--cta-fg)",
        "good-bg": "var(--good-bg)",
        "good-fg": "var(--good-fg)",
        "good-bd": "var(--good-bd)",
        "alert-bg": "var(--alert-bg)",
        "alert-fg": "var(--alert-fg)",
        "inv-good": "var(--inv-good)",
        gold: "var(--gold)",
        "gold-fg": "var(--gold-fg)",
        rose: "var(--rose)",
        "rose-fg": "var(--rose-fg)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        float: "var(--shadow-float)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};