"use client";
import { Workshop } from "@/lib/types";

function fmt(iso: string) {
  const d = new Date(iso);
  // Mostrar en UTC explícito
  return `${d.toUTCString().replace("GMT", "UTC")}`;
}

export default function Card({ w }: { w: Workshop }) {
  return (
    <article className="rounded-2xl border border-muted p-4 bg-card">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold leading-tight">{w.title}</h3>
        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium
                         bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30">
          {w.mode}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{w.description}</p>
      <div className="mt-3 text-sm">
        <div>🗓️ <span className="font-medium">{fmt(w.startsAtISO)}</span></div>
        <div>⏱️ {w.durationMin} min</div>
      </div>
      <div className="mt-4">
        <button className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
          Ver detalles
        </button>
      </div>
    </article>
  );
}
