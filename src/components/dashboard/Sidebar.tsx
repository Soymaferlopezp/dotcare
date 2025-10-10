"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Item = { label: string; emoji?: string; href: string };
type Section = { label: string; href?: string; children?: Item[] };

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [secOpen, setSecOpen] = useState<Record<string, boolean>>({});

  // Persistencia
  useEffect(() => {
    const s = localStorage.getItem("dc_sidebar_collapsed");
    if (s) setCollapsed(s === "1");
    const so = localStorage.getItem("dc_sidebar_sections");
    if (so) {
      try { setSecOpen(JSON.parse(so)); } catch {}
    }
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty("--sbw", collapsed ? "56px" : "260px");
    localStorage.setItem("dc_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);
  useEffect(() => {
    localStorage.setItem("dc_sidebar_sections", JSON.stringify(secOpen));
  }, [secOpen]);

  const tree: Section[] = useMemo(
    () => [
      { label: "Feed", href: "/premium" }, // único
      {
        label: "Intro",
        children: [
          { label: "workshops", emoji: "🎙️", href: "/premium/intro/workshops" },
          { label: "novedades", emoji: "📰", href: "/premium/intro/novedades" },
        ],
      },
      {
        label: "Ayuda",
        children: [
          { label: "comenta aquí", emoji: "💬", href: "/premium/ayuda/comenta" },
          { label: "código de conducta", emoji: "📜", href: "/premium/ayuda/codigo" },
          { label: "soporte", emoji: "🛟", href: "/premium/ayuda/soporte" },
          { label: "feedback", emoji: "📝", href: "/premium/ayuda/feedback" },
        ],
      },
      {
        label: "Cursos & Guías",
        href: "/premium/cursos",
        children: [
          { label: "Método Silva…", emoji: "🧠", href: "/premium/cursos/metodo-silva" },
          { label: "Protocolos de Enfoque…", emoji: "⚡", href: "/premium/cursos/protocolos-de-enfoque" },
          { label: "Cálculo de Riesgo Emocional…", emoji: "📈", href: "/premium/cursos/calculo-de-riesgo" },
        ],
      },
      {
        label: "Datos Interesantes",
        children: [
          { label: "descuentos & apps", emoji: "💎", href: "/premium/datos/descuentos-apps" },
          { label: "especialistas", emoji: "👩‍⚕️", href: "/premium/datos/especialistas" },
        ],
      },
    ],
    []
  );

  const toggleSection = (label: string) =>
    setSecOpen((prev) => ({ ...prev, [label]: !(prev[label] ?? true) }));

  return (
    <aside className="space-y-3" style={{ color: "var(--text)" }}>
      {/* Colapso global */}
      <div className="flex justify-end pr-1">
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expandir" : "Colapsar"}
          className="rounded-full w-8 h-8 grid place-items-center"
          style={{
            background: "color-mix(in oklab, var(--emerald) 12%, transparent)",
            color: "var(--text)",
          }}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? "❯" : "❮"}
        </button>
      </div>

      {tree.map((sec) => {
        const hasChildren = !!sec.children?.length;
        const sectionActive =
          (sec.href && (pathname === sec.href || pathname.startsWith(sec.href + "/"))) ||
          !!sec.children?.some((i) => i.href === pathname);

        // FEED u otras secciones sin hijos: un único link con pill
        if (!hasChildren && sec.href) {
          const active = pathname === sec.href;
          return (
            <div key={sec.label}>
              <ul>
                <li>
                  <Link
                    href={sec.href}
                    aria-current={active ? "page" : undefined}
                    className={`side-pill ${active ? "is-active" : ""} no-underline block`}
                    style={{ color: "var(--text)" }}
                    title={collapsed ? sec.label : undefined}
                  >
                    {collapsed ? sec.label[0].toUpperCase() : sec.label}
                  </Link>
                </li>
              </ul>
            </div>
          );
        }

        // Secciones con hijos (título-link + flecha hover + items)
        const open = secOpen[sec.label] ?? true;

        return (
          <div key={sec.label}>
            {/* Título de sección (puede ser link si tiene href) */}
            <div
              className="sidebar-title group flex items-center justify-between"
              style={{ paddingLeft: collapsed ? 6 : 8 }}
            >
              {/* Cuando NO está colapsado: el título usa pill y puede ser link */}
              {!collapsed ? (
                sec.href ? (
                  <Link
                    href={sec.href}
                    aria-current={sectionActive ? "page" : undefined}
                    className={`side-pill ${sectionActive ? "is-active" : ""} no-underline`}
                    style={{ color: "var(--text)" }}
                  >
                    {sec.label}
                  </Link>
                ) : (
                  <span className="side-pill" style={{ color: "var(--text)" }}>
                    {sec.label}
                  </span>
                )
              ) : (
                // En colapsado: solo la inicial
                <span>{sec.label[0].toUpperCase()}</span>
              )}

              {/* Flechita — solo visible en hover y cuando NO está colapsado */}
              {hasChildren && !collapsed && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSection(sec.label);
                  }}
                  aria-label={open ? `Contraer ${sec.label}` : `Expandir ${sec.label}`}
                  aria-expanded={open}
                  className="opacity-0 group-hover:opacity-100 transition-opacity rounded w-6 h-6 grid place-items-center"
                  style={{
                    color: "var(--text)",
                    background: "transparent",
                  }}
                  title={open ? "Contraer" : "Expandir"}
                >
                  {/* chevron sutil según estado */}
                  <span aria-hidden>{open ? "▾" : "▸"}</span>
                </button>
              )}
            </div>

            {/* Items hijos (colapsables) */}
            {open && (
              <ul className={collapsed ? "space-y-2" : "pl-1 space-y-1"}>
                {sec.children?.map((i) => {
                  const active = pathname === i.href;
                  return (
                    <li key={`${sec.label}-${i.href}`} className="relative">
                      <Link
                        href={i.href}
                        aria-current={active ? "page" : undefined}
                        className={`side-pill ${active ? "is-active" : ""} no-underline flex items-center gap-2`}
                        style={{
                          color: "var(--text)",
                          justifyContent: collapsed ? "center" : "flex-start",
                          paddingLeft: collapsed ? 0 : 10,
                          paddingRight: collapsed ? 0 : 10,
                        }}
                        title={collapsed ? i.label : undefined}
                      >
                        <span className="text-base" aria-hidden>{i.emoji ?? "•"}</span>
                        {!collapsed && <span className="text-sm">{i.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}
