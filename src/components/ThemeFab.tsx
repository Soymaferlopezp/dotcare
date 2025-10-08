"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeFab() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? theme ?? resolvedTheme : "dark") as "light" | "dark";
  const toggle = () => setTheme(current === "dark" ? "light" : "dark");

  return (
    <button
      id="theme-fab"
      onClick={toggle}
      aria-label="Cambiar tema"
      title={current === "dark" ? "Modo claro" : "Modo oscuro"}
      className="fixed bottom-4 right-4 z-50 rounded-full border border-zinc-300 bg-white/90 px-3 py-2 text-lg shadow-md backdrop-blur
                 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:bg-zinc-900"
    >
      {current === "dark" ? "☀︎" : "☾"}
    </button>
  );
}
