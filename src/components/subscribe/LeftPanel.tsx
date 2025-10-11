"use client";

type Props = {
  // selección plan
  plan: "monthly" | "yearly";
  onPlanChange: (p: "monthly" | "yearly") => void;

  // cupón
  couponCode: string;
  onCouponChange: (v: string) => void;
  couponValidFormat: boolean;
  onApplyCoupon: () => void;
  couponApplyDisabled: boolean;
  applyError: string | null;

  // totales
  totalDueTodayText: string;
  nextCharge: string;

  // detalles (si aplicas un modal/accordion tuyo)
  onOpenDetails: () => void;
  detailsOpen: boolean;
  onCloseDetails: () => void;

  // datos numéricos (si los muestras)
  basePriceCents: number;
  discountBps: number;
  finalPriceCents: number;

  // estado
  loadingSession: boolean;

  // NUEVO: cuando está embebido en el “cuadro grande”
  embedded?: boolean;
};

export default function LeftPanel({
  plan,
  onPlanChange,
  couponCode,
  onCouponChange,
  couponValidFormat,
  onApplyCoupon,
  couponApplyDisabled,
  applyError,
  totalDueTodayText,
  nextCharge,
  basePriceCents,
  discountBps,
  finalPriceCents,
  loadingSession,
  onOpenDetails,
  detailsOpen,
  onCloseDetails,
  embedded = false,
}: Props) {
  // util
  const priceBaseUsd = (basePriceCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const discountPct = `${(discountBps / 100).toFixed(2)}%`;

  return (
    <div className="space-y-6">
      {/* 1) Selecciona tu plan */}
    <section className="space-y-2">
      <h2 className="text-base font-medium">Selecciona tu plan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Opción: Mensual */}
        <label
          className={`group relative cursor-pointer rounded-xl border p-4 transition
          ${plan === "monthly"
            ? "border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/30"
            : "border-zinc-800 hover:border-zinc-700"}`}
          htmlFor="plan-monthly"
        >
          <div className="flex items-start gap-3">
            <input
              id="plan-monthly"
              type="radio"
              name="plan"
              value="monthly"
              checked={plan === "monthly"}
              onChange={() => onPlanChange("monthly")}
              className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600 cursor-pointer"
            />
            <div>
              <div className="text-lg font-semibold leading-snug">
                $20<span className="text-sm font-normal">/mensual</span>
              </div>
              <div className="text-xs text-zinc-400">
                Suscripción mensual
              </div>
            </div>
          </div>
        </label>

        {/* Opción: Anual */}
        <label
          className={`group relative cursor-pointer rounded-xl border p-4 transition
          ${plan === "yearly"
            ? "border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/30"
            : "border-zinc-800 hover:border-zinc-700"}`}
          htmlFor="plan-yearly"
        >
          <div className="flex items-start gap-3">
            <input
              id="plan-yearly"
              type="radio"
              name="plan"
              value="yearly"
              checked={plan === "yearly"}
              onChange={() => onPlanChange("yearly")}
              className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600 cursor-pointer"
            />
            <div>
              <div className="text-lg font-semibold leading-snug">
                $144<span className="text-sm font-normal">/anual</span>
              </div>
              <div className="text-xs text-zinc-400">
                Suscripción anual • <span style={{ color: "var(--emerald)" }}>ahorras 5 meses</span>
              </div>
            </div>
          </div>
        </label>
      </div>
    </section>


      {/* divisor */}
      <div className="h-px bg-zinc-800" />

      {/* 2) Cupón */}
      <section className="space-y-2">
        {(() => {
          const allowed = new Set(["NERDCONF-25", "DOTLOVER"]);
          const codeUpper = (couponCode || "").toUpperCase();
          const hasText = codeUpper.length > 0;
          const isAllowedActive = allowed.has(codeUpper);

          const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
            if (e.key === "Enter" && hasText && isAllowedActive && !couponApplyDisabled) {
              onApplyCoupon();
            }
          };

          return (
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={couponCode}
                  onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
                  onKeyDown={onKeyDown}
                  placeholder="Código del cupón"
                  className={`w-full rounded-xl border bg-transparent px-3 py-2 outline-none transition
                  ${!hasText || isAllowedActive ? "border-zinc-700 focus:border-emerald-500" : "border-red-500"}`}
                />
                {/* Botón: solo aparece si hay texto */}
                {hasText && (
                <button
                  onClick={onApplyCoupon}
                  disabled={couponApplyDisabled}
                  className="dc-btn dc-btn-primary"
                >
                  Aplicar
                </button>
                )}
              </div>

              {/* Mensajería */}
              {!hasText ? (
                <p className="text-xs text-zinc-500">
                  ¡Tenemos 2 Códigos activos!
                </p>
              ) : !isAllowedActive ? (
                <p className="text-xs text-red-400">
                  Código inválido o inactivo. 
                </p>
              ) : null}

              {applyError ? <p className="text-xs text-red-400">{applyError}</p> : null}
            </>
          );
        })()}
      </section>

      {/* divisor */}
      <div className="h-px bg-zinc-800" />

      {/* 3) Total due today */}
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Total due today</h3>
        <span className="text-lg font-semibold">
          {totalDueTodayText}
        </span>
      </div>

  {/* Link para abrir modal de detalles */}
  <button
    type="button"
    onClick={onOpenDetails}
    className="text-sm underline underline-offset-4 text-zinc-300 hover:text-zinc-100"
  >
    Ver detalles del pedido
  </button>

  {/* Próximo pago (texto clarito) */}
  <p className="text-sm text-zinc-400">
    {nextCharge}
  </p>
</section>

{/* -------- Modal de Detalles del Pedido -------- */}
{detailsOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xl font-semibold">Resumen del pedido</h4>
        <button
          onClick={onCloseDetails}
          className="text-zinc-400 hover:text-zinc-100 text-xl leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Línea */}
      <div className="h-px bg-zinc-800 my-3" />

      {/* Cálculos locales para mostrar desglose */}
      {(() => {
        const fmt = (cents: number) =>
          (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
        const base = fmt(basePriceCents);
        const final = fmt(finalPriceCents);
        const discountAbsCents = Math.max(basePriceCents - finalPriceCents, 0);
        const discountAbs = fmt(discountAbsCents);
        const discountPct = (discountBps / 100).toFixed(2);

        const isYearly = plan === "yearly";
        const labelFuture = isYearly ? "Pagos anuales" : "Pagos mensuales";
        const schedule =
          isYearly
            ? "Frecuencia: Anual, cancela cuando quieras."
            : "Frecuencia: Mensual, cancela cuando quieras.";

        return (
          <div className="space-y-4">
            {/* Hoy */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">Pago de hoy</span>
              <span className="text-sm font-medium">{final}</span>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Futuro */}
            <div>
              <div className="text-sm font-medium mb-1">Pagos futuros</div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">
                  {labelFuture} a partir de {nextCharge}
                </span>
                <span className="text-sm font-medium">{final}</span>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Desglose (opcional) */}
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Precio base</span>
                <span className="text-zinc-300">{base}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Descuento ({discountPct}%)</span>
                <span className="text-zinc-300">- {discountAbs}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold">Total de hoy</span>
                <span className="font-semibold">{final}</span>
              </div>
              <p className="text-xs text-zinc-500 pt-2">{schedule}</p>
            </div>
          </div>
        );
      })()}

      {/* Footer acciones */}
      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onCloseDetails}
          className="rounded-xl border border-zinc-700 hover:border-zinc-500 px-4 py-2 text-sm transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}




    </div>
  );
}
