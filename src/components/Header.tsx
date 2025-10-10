"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";

type Item = { label: string; href: string };
const NAV: Item[] = [
  { label: "Beneficios", href: "#beneficios" },
  { label: "Planes", href: "#planes" },
  { label: "Equipo", href: "#equipo" },
];

export default function Header() {
  const [active, setActive] = useState<string>("");

  // Al cargar, si hay hash en la URL, lo usamos como activo
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      setActive(window.location.hash);
    }
  }, []);

  const onNavClick = (href: string) => {
    setActive(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-ink/80 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3"
        role="navigation"
        aria-label="Principal"
      >
        {/* Brand → siempre al landing */}
        <Link href="/" className="flex items-center gap-2" aria-label="Ir al inicio">
          {/* Light theme -> versión light */}
          <Image
            src="/brand/dotcare_light.png"
            alt="DOTCARE"
            width={110}
            height={28}
            className="block dark:hidden"
            priority
          />
          {/* Dark theme -> versión dark */}
          <Image
            src="/brand/dotcare_dark.png"
            alt="DOTCARE"
            width={110}
            height={28}
            className="hidden dark:block"
            priority
          />
        </Link>

        {/* Nav pills */}
        <div className="ml-4 hidden items-center gap-2 md:flex">
          {NAV.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => onNavClick(item.href)}
                className={`nav-pill ${isActive ? "nav-pill-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-3">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </nav>
    </header>
  );
}
