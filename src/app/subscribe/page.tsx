"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LeftPanel from "@/components/subscribe/LeftPanel";
import RightPanel from "@/components/subscribe/RightPanel";
import "@/styles/checkout.css";
import {
  Plan, centsForPlan, applyDiscountBps, formatCentsUSD, isValidCouponFormat, nextChargeText,
} from "@/lib/pricing";
import { useRouter } from "next/navigation";
import LogoMini from "@/components/subscribe/LogoMini";

type ApplyCodeResult = {
  sessionId: string; base_price_cents: number; discount_bps: number;
  final_price_cents: number; final_price_label: string; status: string;
};

export default function SubscribePage() {
  const router = useRouter();

  const [plan, setPlan] = useState<Plan>("monthly");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState<string>("");
  const [couponValidFormat, setCouponValidFormat] = useState<boolean>(true);
  const [discountBps, setDiscountBps] = useState<number>(0);

  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [termsChecked, setTermsChecked] = useState<boolean>(false);

  const [loadingSession, setLoadingSession] = useState<boolean>(false);
  const [applyingCode, setApplyingCode] = useState<boolean>(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const [confirming, setConfirming] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const creatingRef = useRef(0);

  const basePriceCents = useMemo(() => centsForPlan(plan), [plan]);
  const finalPriceCents = useMemo(() => applyDiscountBps(basePriceCents, discountBps), [basePriceCents, discountBps]);
  const totalDueTodayText = useMemo(() => formatCentsUSD(finalPriceCents), [finalPriceCents]);
  const nextCharge = useMemo(() => nextChargeText(plan), [plan]);

  const persistSession = (id: string) => {
    setSessionId(id);
    try { localStorage.setItem("dotcare_session_id", id); } catch {}
  };
  const resetDiscountLocal = () => { setDiscountBps(0); setApplyError(null); };

  useEffect(() => {
    let cancelled = false;
    const idx = ++creatingRef.current;
    async function createSession() {
      setLoadingSession(true); setApplyError(null); resetDiscountLocal();
      try {
        const res = await fetch("/api/checkout/session", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
        if (!res.ok) throw new Error(`Session error (${res.status})`);
        const data = (await res.json()) as { sessionId: string };
        if (!cancelled && creatingRef.current === idx) persistSession(data.sessionId);
      } catch (err) { console.error(err); }
      finally { if (!cancelled && creatingRef.current === idx) setLoadingSession(false); }
    }
    createSession();
    return () => { cancelled = true; };
  }, [plan]);

  useEffect(() => { setCouponValidFormat(!couponCode || isValidCouponFormat(couponCode)); }, [couponCode]);

  const handleApplyCoupon = async () => {
    if (!sessionId || !couponCode || !couponValidFormat) return;
    setApplyingCode(true); setApplyError(null);
    try {
      const res = await fetch("/api/checkout/apply-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, code: couponCode.toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Apply code failed");
      const parsed = data as ApplyCodeResult;
      setDiscountBps(parsed.discount_bps);
    } catch (err: any) { setDiscountBps(0); setApplyError(err?.message || "No se pudo aplicar el cupón."); }
    finally { setApplyingCode(false); }
  };

  const handleConfirmTransfer = async () => {
    setConfirmError(null);
    if (!termsChecked) return;
    if (!sessionId) { setConfirmError("No hay sesión de checkout activa."); return; }
    setConfirming(true);
    try {
      const res = await fetch("/api/checkout/confirm-offchain", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Confirmación fallida");
      router.push(`/subscribe/success?sessionId=${encodeURIComponent(sessionId)}`);
    } catch (err: any) { setConfirmError(err?.message || "No se pudo confirmar."); }
    finally { setConfirming(false); }
  };

  const couponApplyDisabled = !sessionId || !couponCode || !couponValidFormat || applyingCode || loadingSession;

  return (
    <main id="subscribe-root" className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <section
        id="subscribe-container"
        className="mx-auto w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Header izquierdo: SOLO logo */}
        <div id="left-column" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><LogoMini /></div>
            {/* Eliminado el mini toggle para evitar botón duplicado */}
            <div aria-hidden className="w-8 h-8" />
          </div>

          <LeftPanel
            plan={plan}
            onPlanChange={setPlan}
            couponCode={couponCode}
            onCouponChange={setCouponCode}
            couponValidFormat={couponValidFormat}
            onApplyCoupon={handleApplyCoupon}
            couponApplyDisabled={couponApplyDisabled}
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

        {/* Columna derecha */}
        <div id="right-column" className="space-y-6">
          <RightPanel
            termsChecked={termsChecked}
            onTermsChange={setTermsChecked}
            onConfirmTransfer={handleConfirmTransfer}
            confirmDisabled={!termsChecked || !sessionId || confirming || loadingSession}
            confirming={confirming}
            confirmError={confirmError}
          />
        </div>
      </section>

      <footer className="mx-auto mt-8 w-full max-w-6xl px-4 pb-8 text-xs text-zinc-600 dark:text-zinc-500">
        <p>Nota: Este checkout es off-chain en Hito 2. La verificación on-chain y mint de NFT llegarán en Hito 3.</p>
        <p className="mt-2">
          Links dummy:{" "}
          <Link href="#" className="underline hover:text-zinc-900 dark:hover:text-zinc-300">Términos</Link>{" "}
          ·{" "}
          <Link href="#" className="underline hover:text-zinc-900 dark:hover:text-zinc-300">Privacidad</Link>
        </p>
      </footer>
    </main>
  );
}
