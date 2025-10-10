"use client";
import { useEffect, useState } from "react";
import Card from "@/components/dashboard/Workshops/Card";
import PastItem from "@/components/dashboard/Workshops/PastItem";
import type { Workshop } from "@/lib/types";

/** Inline Filters (evita warning de props serializables en Client Entry) */
function InlineFilters({
  value,
  onChange,
}: {
  value: "upcoming" | "past";
  onChange: (v: "upcoming" | "past") => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange("upcoming")}
        className={`px-3 py-1.5 rounded-lg border text-sm ${
          value === "upcoming"
            ? "bg-primary/10 text-primary border-primary/30"
            : "hover:bg-muted border-muted"
        }`}
      >
        Próximamente
      </button>
      <button
        onClick={() => onChange("past")}
        className={`px-3 py-1.5 rounded-lg border text-sm ${
          value === "past"
            ? "bg-primary/10 text-primary border-primary/30"
            : "hover:bg-muted border-muted"
        }`}
      >
        Pasados
      </button>
    </div>
  );
}

export default function WorkshopsPage() {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [items, setItems] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/workshops?filter=${filter}`)
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setItems(j.data ?? []);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Workshops</h1>
        <InlineFilters value={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div className="rounded-xl border border-muted p-6 text-sm text-muted-foreground">
          Cargando…
        </div>
      ) : filter === "upcoming" ? (
        items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((w) => (
              <Card key={w.id} w={w} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-muted p-8 text-center">
            <div className="text-3xl mb-2">🗓️</div>
            <p className="font-medium">No hay eventos próximos…</p>
            <p className="text-sm text-muted-foreground">
              Pronto anunciaremos nuevas fechas. Mientras tanto, revisa{" "}
              <a className="underline" href="/premium/cursos">
                Cursos & Guías
              </a>
              .
            </p>
          </div>
        )
      ) : (
        <ul className="rounded-2xl border border-muted divide-y divide-muted/50 bg-card">
          {items.map((w) => (
            <PastItem key={w.id} w={w} />
          ))}
          {items.length === 0 && (
            <li className="p-6 text-sm text-muted-foreground">No hay workshops pasados.</li>
          )}
        </ul>
      )}
    </div>
  );
}
