"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? theme ?? resolvedTheme : "dark") as "light" | "dark";
  const toggle = () => setTheme(current === "dark" ? "light" : "dark");

  return (
    <button
      type="button"
      aria-label="Cambiar tema"
      onClick={toggle}
      className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white/70 px-2 py-1 text-sm
                 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
      title={current === "dark" ? "Modo claro" : "Modo oscuro"}
    >
      {current === "dark" ? "☀︎" : "☾"}
    </button>
  );
}
