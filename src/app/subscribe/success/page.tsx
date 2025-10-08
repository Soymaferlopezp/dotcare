"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatCentsUSD, nextChargeText, Plan } from "@/lib/pricing";

type SessionDTO = {
  id: string;
  plan: Plan;
  base_price_cents: number;
  discount_bps: number;
  final_price_cents: number;
  code: string | null;
  status: string;
  paid_offchain: boolean;
  created_at: string;
  expires_at: string | null;
};

export default function SubscribeSuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("sessionId") || "";
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [session, setSession] = useState<SessionDTO | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!sessionId) {
        setErr("Falta sessionId en la URL.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/checkout/${encodeURIComponent(sessionId)}`);
        const data = (await res.json()) as unknown;
        if (!res.ok) throw new Error((data as { error?: string })?.error || "No se pudo obtener la sesión.");
        if (!cancelled) setSession(data as SessionDTO);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Error inesperado.";
        if (!cancelled) setErr(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [sessionId]);

  const planLabel = useMemo(() => (!session ? "" : session.plan === "monthly" ? "Mensual" : "Anual"), [session]);
  const baseLabel = useMemo(() => (session ? formatCentsUSD(session.base_price_cents) : ""), [session]);
  const discountLabel = useMemo(() => (!session ? "" : session.discount_bps > 0 ? `-${(session.discount_bps / 100).toFixed(2)}%` : "$0.00"), [session]);
  const finalLabel = useMemo(() => (session ? formatCentsUSD(session.final_price_cents) : ""), [session]);
  const nextCharge = useMemo(() => (session ? nextChargeText(session.plan) : ""), [session]);

  return (
    <main id="subscribe-success-root" className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto w-full max-w-3xl px-4 py-14">
        <h1 className="text-2xl font-semibold text-center">¡Gracias por tu apoyo!</h1>

        {loading && <p className="mt-6 text-center text-zinc-300">Cargando detalles de tu orden…</p>}

        {!loading && err && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-red-700/60 bg-red-900/20 p-4">
            <p className="text-sm text-red-300">{err}</p>
            <p className="mt-3 text-xs text-red-200/80">
              Asegúrate de llegar a esta página tras completar el checkout: <code>/subscribe/success?sessionId=...</code>
            </p>
            <div className="mt-4 text-center">
              <Link href="/subscribe" className="inline-block rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">
                Volver al checkout
              </Link>
            </div>
          </div>
        )}

        {!loading && !err && session && (
          <div className="mx-auto mt-8 max-w-xl space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h2 className="text-base font-medium">Resumen de tu pedido</h2>

              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-zinc-300">Plan</dt>
                  <dd className="font-medium">{planLabel}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-zinc-300">Precio base</dt>
                  <dd>{baseLabel}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-zinc-300">Descuento {session.code ? `(${session.code})` : ""}</dt>
                  <dd>{discountLabel}</dd>
                </div>

                <div className="mt-2 border-t border-zinc-800 pt-2 flex items-center justify-between">
                  <dt className="font-semibold">Total pagado hoy</dt>
                  <dd className="font-semibold">{finalLabel}</dd>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-zinc-400">{nextCharge}</p>
                </div>

                <div className="mt-3">
                  <p className="text-xs">
                    Estado de la sesión: <span className="font-mono">{session.status}</span>{" "}
                    {session.paid_offchain && (
                      <span className="ml-2 rounded bg-emerald-900/40 px-2 py-0.5 text-emerald-300">paid_offchain</span>
                    )}
                  </p>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h3 className="text-sm font-semibold">¿Qué sigue? (Hito 3)</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                <li>Validaremos en cadena la transferencia (monto y wallet origen).</li>
                <li>Marcaremos la sesión como <code>onchain_success</code> y activaremos tu suscripción.</li>
                <li>Haremos el mint de tu NFT de membresía.</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Link href="/subscribe" className="inline-block rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">
                Ver planes
              </Link>
              <Link href="/subscribe" className="inline-block rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800">
                Volver al checkout
              </Link>
            </div>

            <p className="text-center text-xs text-zinc-500">
              ID de sesión: <span className="font-mono">{session.id}</span>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
