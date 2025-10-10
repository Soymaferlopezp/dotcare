import Link from "next/link";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      {/* Skip link (usa estilos de globals.css) */}
      <a href="#main" className="skip-link">Saltar al contenido</a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: "var(--border)" }}>
        <Header />
      </header>

      {/* Shell */}
      <div className="grid gap-4 p-4" style={{ gridTemplateColumns: "var(--sbw,260px) 1fr" }}>
        {/* Sidebar */}
        <nav
          aria-label="Secciones del dashboard"
          className="sticky top-[4.25rem] h-[calc(100vh-5.25rem)] overflow-auto pr-2"
        >
          <Sidebar />
        </nav>

        {/* Main */}
        <main id="main" role="main" className="pb-16">
          <div aria-live="polite" aria-atomic="true" className="sr-only" id="sr-live" />
          {children}
        </main>
      </div>

    </div>
  );
}
