"use client";
import Link from "next/link";

type Item = {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  minutesTotal: number;
  progressPct: number;
  modulesCount: number;
};

export default function CoursesList({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((c) => (
        <Link
          key={c.id}
          href={`/premium/cursos/${c.slug}`}
          className="rounded-2xl border border-muted p-4 hover:bg-muted/40 transition"
        >
          <h3 className="font-semibold leading-tight">{c.title}</h3>
          {c.tagline && <p className="text-sm text-muted-foreground mt-1">{c.tagline}</p>}
          <div className="mt-3 text-xs text-muted-foreground">
            {c.modulesCount} módulos • {c.minutesTotal} min
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span>Progreso</span>
            <span>{Math.round(c.progressPct)}%</span>
          </div>
          <div className="mt-2 w-full h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.min(Math.max(c.progressPct, 0), 100)}%` }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
