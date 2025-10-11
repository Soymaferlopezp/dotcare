"use client";
import Link from "next/link";
import { RIGHT_NEWS } from "@/lib/demoData";


function prettyDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export default function RightNews() {
  return (
    <aside className="rounded-2xl border border-muted p-4 bg-card">
      <h3 className="font-semibold mb-3">Nuevos cursos / actualizaciones</h3>
      <ul className="space-y-3">
        {RIGHT_NEWS.map((n) => (
          <li key={n.id} className="rounded-xl border border-muted p-3 hover:bg-muted/40 transition">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{prettyDate(n.dateISO)}</span>
              {n.tag && (
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium
                                  bg-cyan-500/15 text-cyan-400 ring-1 ring-inset ring-cyan-500/30">
                  {n.tag}
                </span>
              )}
            </div>
            {n.href ? (
              <Link href={n.href} className="mt-1 block font-medium hover:underline">
                {n.title}
              </Link>
            ) : (
              <p className="mt-1 font-medium">{n.title}</p>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs text-muted-foreground">
        ¿Buscas más? Explora <Link href="/premium/cursos/" className="nav-pill" style={{ color: "var(--text)" }}>
  Cursos & Guias →
</Link>.
      </div>
    </aside>
  );
}
