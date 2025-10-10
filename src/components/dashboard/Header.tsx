"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Notifications() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState([
    { id: "n1", text: "Nuevo módulo en Protocolos de Enfoque", href: "/premium/cursos/protocolos-de-enfoque", date: "hace 2h", unread: true },
    { id: "n2", text: "Workshop agendado: 12 oct 18:00 UTC", href: "/premium/intro/workshops", date: "ayer", unread: true },
    { id: "n3", text: "Actualización de la guía ‘Matriz de Eisenhower’", href: "/premium/cursos", date: "esta semana", unread: false },
  ]);
  const unreadCount = items.filter(i => i.unread).length;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDocClick); document.removeEventListener("keydown", onEsc); };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        aria-label="Notificaciones"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="relative px-2 py-1 rounded-md"
        style={{ background: "transparent", color: "var(--text)" }}
      >
        🔔
        {unreadCount > 0 && (
          <span aria-hidden className="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-0.5 rounded-full"
                style={{ background: "var(--emerald)", color: "#0A0D0A" }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div ref={popRef} role="dialog" aria-label="Notificaciones"
             className="absolute right-0 mt-2 w-[320px] rounded-lg shadow-xl border"
             style={{ background: "var(--panel)", color: "var(--text)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="font-semibold">Notificaciones</span>
            <button onClick={() => setItems(prev => prev.map(i => ({...i, unread:false})))}
                    className="text-sm opacity-80 hover:opacity-100 px-2 py-1 rounded" style={{ color: "var(--text)" }}>
              Marcar leídas
            </button>
          </div>
          <ul className="max-h-80 overflow-auto">
            {items.length === 0 && <li className="px-3 py-4 text-sm opacity-80">No tienes notificaciones.</li>}
            {items.map(n => (
              <li key={n.id}>
                <Link href={n.href || "#"} onClick={() => setOpen(false)} className="block px-3 py-2 no-underline"
                      style={{ color: "var(--text)", background: n.unread ? "color-mix(in oklab, var(--emerald) 12%, transparent)" : "transparent" }}>
                  <div className="text-sm">{n.text}</div>
                  <div className="text-xs opacity-70">{n.date}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { theme } = useTheme();
  const pathname = usePathname();

  const nav = [
    { href: "/premium", label: "Inicio" },
    { href: "/premium/cursos", label: "Cursos & Guías" },
    { href: "/premium/intro/workshops", label: "Workshops" },
    { href: "/subscribe", label: "+Info" },
    { href: "/premium/perfil", label: "Perfil" },
  ];

  const logoSrc = theme === "light" ? "/brand/dotcare_light.png" : "/brand/dotcare_dark.png";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3"
         style={{ background: "var(--panel)", color: "var(--text)" }}>
      <div className="flex items-center">
        <Link href="/premium" className="flex items-center gap-2 no-underline">
          <img src={logoSrc} alt="DOTCARE" className="h-7 w-auto" />
        </Link>
      </div>

      <nav className="flex items-center gap-2 justify-center">
        {nav.map((i, idx) => {
          const active = pathname === i.href || (i.href !== "/premium" && pathname?.startsWith(i.href));
          return (
            <Link
              key={`${i.href}-${idx}`}   
              href={i.href}
              aria-current={active ? "page" : undefined}
              className={`nav-pill ${active ? "is-active" : ""}`}
              style={{ color: "var(--text)" }}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-end gap-3">
        <Notifications />
        <ConnectButton showBalance={false} accountStatus={{ smallScreen: "avatar", largeScreen: "full" }} />
      </div>
    </div>
  );
}
