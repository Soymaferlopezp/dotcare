"use client";
import { useEffect, useState } from "react";
import type { InvoiceRow, SubscriptionRow } from "@/lib/types";

export default function Billing() {
  const [tab, setTab] = useState<"sub" | "hist">("sub");
  const [sub, setSub] = useState<SubscriptionRow | null>(null);
  const [hist, setHist] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing")
      .then((r) => r.json())
      .then((j) => { setSub(j.subscription); setHist(j.history ?? []); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl p-4" style={{ background: "var(--panel)", border: `1px solid var(--border)` }}>
      <div className="flex items-center gap-2">
        <button onClick={() => setTab("sub")} className={`nav-pill ${tab==="sub"?"is-active":""}`} style={{ color: "var(--text)" }}>
          Suscripción
        </button>
        <button onClick={() => setTab("hist")} className={`nav-pill ${tab==="hist"?"is-active":""}`} style={{ color: "var(--text)" }}>
          Historial
        </button>
      </div>

      <div className="mt-4">
        {loading && <div className="text-sm opacity-70">Cargando…</div>}

        {tab === "sub" && sub && (
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2">Producto</th>
                <th className="py-2">Status</th>
                <th className="py-2">Monto</th>
                <th className="py-2">Renovación</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="py-2">{sub.product}</td>
                <td className="py-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `color-mix(in oklab, ${sub.status==="activo"?"var(--success)":"var(--amber)"} 20%, transparent)` }}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-2">${sub.amountUsd}</td>
                <td className="py-2">{new Date(sub.renewISO).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        )}

        {tab === "hist" && (
          <table className="w-full text-sm">
            <thead className="text-left opacity-70">
              <tr>
                <th className="py-2">Fecha</th>
                <th className="py-2">Producto</th>
                <th className="py-2">Monto</th>
                <th className="py-2">Status</th>
                <th className="py-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {hist.map((r) => (
                <tr key={r.txHash} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="py-2">{new Date(r.dateISO).toLocaleDateString()}</td>
                  <td className="py-2">{r.product}</td>
                  <td className="py-2">${r.amountUsd}</td>
                  <td className="py-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in oklab, var(--success) 20%, transparent)" }}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <a href={r.explorerUrl} target="_blank" rel="noreferrer" className="no-underline hover:underline">
                      {r.txHash} <span aria-hidden>↗</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
