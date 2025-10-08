export type Plan = "monthly" | "yearly";

export const PLAN_MONTHLY_CENTS = 2000;  // $20.00
export const PLAN_YEARLY_CENTS = 14400; // $144.00

export function centsForPlan(plan: Plan): number {
  return plan === "monthly" ? PLAN_MONTHLY_CENTS : PLAN_YEARLY_CENTS;
}

/** Aplica descuento en basis points (0–10000) y redondea al centavo. */
export function applyDiscountBps(baseCents: number, discountBps: number): number {
  const clamped = Math.max(0, Math.min(10000, discountBps));
  const discount = Math.round((baseCents * clamped) / 10000);
  return Math.max(0, baseCents - discount);
}

/** Formatea centavos a USD. */
export function formatCentsUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  );
}

/** Valida formato local del cupón: A-Z, 0-9 y '-', 3–24 chars. */
export function isValidCouponFormat(code: string): boolean {
  const trimmed = (code || "").trim();
  if (trimmed.length < 3 || trimmed.length > 24) return false;
  return /^[A-Z0-9-]+$/.test(trimmed);
}

/** Calcula y devuelve un texto amigable del próximo cobro según plan. */
export function nextChargeText(plan: Plan, from = new Date()): string {
  const d = new Date(from);
  if (plan === "monthly") {
    d.setDate(d.getDate() + 30);
  } else {
    d.setDate(d.getDate() + 365);
  }
  const formatter = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  const when = formatter.format(d);
  return plan === "monthly"
    ? `Siguiente pago: ${when} (plan mensual).`
    : `Siguiente pago: ${when} (plan anual).`;
}
