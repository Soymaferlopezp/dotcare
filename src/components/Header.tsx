"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-ink/80 backdrop-blur">
      <nav
        className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3"
        role="navigation"
        aria-label="Principal"
      >
        {/* Brand */}
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

        {/* Links */}
        <div className="ml-4 hidden items-center gap-4 md:flex">
          <a href="#beneficios" className="text-sm text-muted hover:text-text" aria-label="Ir a Beneficios">Beneficios</a>
          <a href="#planes" className="text-sm text-muted hover:text-text" aria-label="Ir a Planes">Planes</a>
          <a href="#equipo" className="text-sm text-muted hover:text-text" aria-label="Ir a Equipo">Equipo</a>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-3">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </nav>
    </header>
  );
}
