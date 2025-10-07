"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
      aria-pressed={isDark}
      title={`Modo ${isDark ? "oscuro" : "claro"}`}
      className="rounded-lg border border-border px-3 py-1.5 text-sm hover:opacity-90"
    >
      Modo: {isDark ? "Oscuro" : "Claro"}
    </button>
  );
}
