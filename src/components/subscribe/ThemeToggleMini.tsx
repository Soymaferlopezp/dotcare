"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggleMini() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? theme ?? resolvedTheme : "dark") as "light" | "dark";
  const toggle = () => setTheme(current === "dark" ? "light" : "dark");

  return (
    <button
      id="theme-toggle-mini-standalone"
      aria-label="Cambiar tema"
      onClick={toggle}
      className="rounded-lg border border-zinc-300 bg-white/60 px-3 py-1 text-sm hover:bg-white
                 dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
    >
      {current === "dark" ? "☀︎" : "☾"}
    </button>
  );
}
