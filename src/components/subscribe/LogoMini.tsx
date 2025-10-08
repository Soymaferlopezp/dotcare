"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Regla:
 * - Fondo oscuro (theme="dark") -> usar logo CLARO (dotcare_light.png)
 * - Fondo claro  (theme="light") -> usar logo OSCURO (dotcare_dark.png)
 */
export default function LogoMini() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? theme ?? resolvedTheme : "dark") as "light" | "dark";
  const src = current === "dark" ? "/brand/dotcare_dark.png" : "/brand/dotcare_light.png";

  return (
    <Image
      id="logo-mini"
      src={src}
      alt="DOTCARE"
      width={120}
      height={32}
      className="h-8 w-auto"
      priority
    />
  );
}
