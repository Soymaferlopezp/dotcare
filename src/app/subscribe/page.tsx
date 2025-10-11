"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LeftPanel from "@/components/subscribe/LeftPanel";
import RightPanel from "@/components/subscribe/RightPanel";
import "@/styles/checkout.css";
import {
  Plan,
  centsForPlan,
  applyDiscountBps,
  formatCentsUSD,
  isValidCouponFormat, 
  nextChargeText,
} from "@/lib/pricing";
import { useRouter } from "next/navigation";
import LogoMini from "@/components/subscribe/LogoMini";
import { SUBSCRIPTION_CONTRACT } from "@/lib/addresses";

type ApplyCodeResult = {
  sessionId: string;
  base_price_cents?: number;
  discount_bps: number;
  final_price_cents?: number;
  final_price_label?: string;
  status?: string;
  code?: string;
  variant?: number;
};

const LS_KEY = "dotcare_coupon_v1";
type SavedCoupon = { sessionId: string; code: string; discount_bps: number; variant: number };

function saveCoupon(c: SavedCoupon) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(c));
  } catch {}
}
function loadCoupon(): SavedCoupon | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedCoupon) : null;
  } catch {
    return null;
  }
}
function clearCoupon() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}

export default function SubscribePage() {
  const router = useRouter();

  const [plan, setPlan] = useState<Plan>("monthly");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState<string>("");
  const [couponValidFormat, setCouponValidFormat] = useState<boolean>(true);
  const [discountBps, setDiscountBps] = useState<number>(0);

  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const [loadingSession, setLoadingSession] = useState<boolean>(false);
  const [applyingCode, setApplyingCode] = useState<boolean>(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const [confirming, setConfirming] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const creatingRef = useRef(0);

  const basePriceCents = useMemo(() => centsForPlan(plan), [plan]);
  const finalPriceCents = useMemo(
    () => applyDiscountBps(basePriceCents, discountBps),
    [basePriceCents, discountBps]
  );
  const totalDueTodayText = useMemo(() => formatCentsUSD(finalPriceCents), [finalPriceCents]);
  const nextCharge = useMemo(() => nextChargeText(plan), [plan]);

  const persistSession = (id: string) => {
    setSessionId(id);
    try {
      localStorage.setItem("dotcare_session_id", id);
    } catch {}
  };
  const resetDiscountLocal = () => {
    setDiscountBps(0);
    setApplyError(null);
  };

  // Crear/actualizar sesión cuando cambia el plan
  useEffect(() => {
    let cancelled = false;
    const idx = ++creatingRef.current;
    async function createSession() {
      setLoadingSession(true);
      setApplyError(null);
      resetDiscountLocal();
      try {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
        if (!res.ok) throw new Error(`Session error (${res.status})`);
        const data = (await res.json()) as { sessionId: string };
        if (!cancelled && creatingRef.current === idx) persistSession(data.sessionId);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        if (!cancelled && creatingRef.current === idx) setLoadingSession(false);
      }
    }
    createSession();
    return () => {
      cancelled = true;
    };
  }, [plan]);

  // Solo para marcar borde/input, NO bloquea el botón
  useEffect(() => {
    setCouponValidFormat(!couponCode || isValidCouponFormat(couponCode));
  }, [couponCode]);

  // Botón de aplicar SIEMPRE activo si hay sesión (aunque el code sea inválido)
  const handleApplyCoupon = async () => {
    if (!sessionId || !couponCode) return;
    setApplyingCode(true);
    setApplyError(null);
    try {
      const res = await fetch("/api/checkout/apply-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code: couponCode.toUpperCase().trim() }),
      });
      const data = (await res.json()) as ApplyCodeResult | { error?: string };

      if (!res.ok) {
        // mostramos el mensaje que vino del server o uno genérico
        const msg = (data as any)?.error || "Código inválido o inactivo.";
        setDiscountBps(0);
        setApplyError(msg);
        clearCoupon();
        return;
      }

      const parsed = data as ApplyCodeResult;
      setDiscountBps(parsed.discount_bps || 0);

      // persistimos para re-aplicar en nuevas sesiones
      saveCoupon({
        sessionId,
        code: String(parsed.code || couponCode.toUpperCase().trim()),
        discount_bps: Number(parsed.discount_bps || 0),
        variant: Number(parsed.variant ?? 0),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo aplicar el cupón.";
      setDiscountBps(0);
      setApplyError(message);
      clearCoupon();
    } finally {
      setApplyingCode(false);
    }
  };

  // Re-aplicar cupón guardado cuando cambia sessionId (por cambio de plan o refresh)
  useEffect(() => {
    if (!sessionId) return;
    const saved = loadCoupon();
    if (saved && saved.code && saved.sessionId !== sessionId) {
      (async () => {
        try {
          const res = await fetch("/api/checkout/apply-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, code: saved.code }),
          });
          const data = (await res.json()) as ApplyCodeResult | { error?: string };
          if (!res.ok) {
            clearCoupon();
            setDiscountBps(0);
            return;
          }
          const parsed = data as ApplyCodeResult;
          setDiscountBps(parsed.discount_bps || 0);
          saveCoupon({
            sessionId,
            code: String(parsed.code || saved.code),
            discount_bps: Number(parsed.discount_bps || 0),
            variant: Number(parsed.variant ?? 0),
          });
        } catch {
          clearCoupon();
          setDiscountBps(0);
        }
      })();
    }
  }, [sessionId]);

  const handleConfirmTransfer = async () => {
    setConfirmError(null);
    if (!sessionId) {
      setConfirmError("No hay sesión de checkout activa.");
      return;
    }
    setConfirming(true);
    try {
      const res = await fetch("/api/checkout/confirm-offchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = (await res.json()) as unknown;
      if (!res.ok) throw new Error((data as { error?: string })?.error || "Confirmación fallida");
      router.push(`/subscribe/success?sessionId=${encodeURIComponent(sessionId)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo confirmar.";
      setConfirmError(message);
    } finally {
      setConfirming(false);
    }
  };

    // Solo lo desactivamos por estados de red/sesión.
  const couponApplyDisabled = !sessionId || applyingCode || loadingSession;

  // Datos para RightPanel
  const explorerBase = "https://passet.subscan.io";
  const contractUrl = SUBSCRIPTION_CONTRACT ? `${explorerBase}/address/${SUBSCRIPTION_CONTRACT}` : "#";
  const txUrl: string | null = null;

  return (
    <main id="subscribe-root" className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section
        id="subscribe-container"
        className="mx-auto w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* IZQUIERDA — logo + card grande con TODO dentro */}
        <div id="left-column" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" aria-label="Ir al inicio">
                <LogoMini />
              </Link>
            </div>
            <div aria-hidden className="w-8 h-8" />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm 
                      text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            aria-label="Volver al inicio de Dotcare"
          >
            ❮ Volver a Dotcare
          </Link>
        

          <div className="rounded-2xl border bg-white border-zinc-200 shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800 p-5">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Membresía Pro | DOTCARE</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                La membresía todo incluido para cuidar tu salud y bienestar mental de verdad. Acceso total a cursos, guías rápidas, tips, retos, workshops y recomendaciones de herramientas.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border"
                  style={{
                    background: "color-mix(in oklab, var(--emerald) 14%, transparent)",
                    borderColor: "color-mix(in oklab, var(--emerald) 36%, transparent)",
                    color: "color-mix(in oklab, var(--emerald) 85%, #064e3b)",
                  }}
                >
                  🚀 To the moon 
                </span>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs border"
                  style={{
                    background: "color-mix(in oklab, var(--emerald) 14%, transparent)",
                    borderColor: "color-mix(in oklab, var(--emerald) 36%, transparent)",
                    color: "color-mix(in oklab, var(--emerald) 85%, #064e3b)",
                  }}
                >
                  ⛽ Por menos del gas fee en ETH
                </span>
              </div>
            </div>

            <div className="my-5 h-px bg-zinc-200 dark:bg-zinc-800" />

            <LeftPanel
              plan={plan}
              onPlanChange={setPlan}
              couponCode={couponCode}
              onCouponChange={setCouponCode}
              couponValidFormat={couponValidFormat}
              onApplyCoupon={handleApplyCoupon}
              couponApplyDisabled={couponApplyDisabled} // 👈 activo si hay sesión; no bloquea por “no permitido”
              applyError={applyError}
              totalDueTodayText={totalDueTodayText}
              nextCharge={nextCharge}
              onOpenDetails={() => setDetailsOpen(true)}
              detailsOpen={detailsOpen}
              onCloseDetails={() => setDetailsOpen(false)}
              basePriceCents={basePriceCents}
              discountBps={discountBps}
              finalPriceCents={finalPriceCents}
              loadingSession={loadingSession}
            />
          </div>
        </div>

        {/* DERECHA — wallet/QR/copy con light limpio */}
        <div id="right-column" className="space-y-6">
          <RightPanel
            onConfirmTransfer={handleConfirmTransfer}
            confirming={confirming}
            confirmError={confirmError}
            contractUrl={contractUrl}
            txUrl={txUrl}
          />
        </div>
      </section>

      <footer className="mx-auto mt-8 w-full max-w-6xl px-4 pb-8 text-xs text-zinc-600 dark:text-zinc-500">
        <p>
          <Link href="/terminos" className="underline hover:text-zinc-900 dark:hover:text-zinc-300">
            Términos
          </Link>{" "}
          ·{" "}
          <Link href="/privacidad" className="underline hover:text-zinc-900 dark:hover:text-zinc-300">
            Privacidad
          </Link>
        </p>
      </footer>
    </main>
  );
}
