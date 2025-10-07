/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Mapeo directo a CSS variables de tokens.css
        ink: "var(--ink)",
        surface: "var(--surface)",
        panel: "var(--panel)",
        text: "var(--text)",
        muted: "var(--muted)",
        border: "var(--border)",
        emerald: "var(--emerald)",
        cyan: "var(--cyan)",
        magenta: "var(--magenta)",
        violet: "var(--violet)",
        amber: "var(--amber)",
        success: "var(--success)",
        error: "var(--error)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"], // Space Grotesk
        sans: ["var(--font-sans)", "system-ui", "sans-serif"], // Inter
        mono: ["var(--font-mono)", "monospace"], // JetBrains Mono
      },
    },
  },
  plugins: [],
};
