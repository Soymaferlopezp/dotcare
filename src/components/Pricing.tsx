"use client";
import Link from "next/link";
import { useState } from "react";
import { copy } from "../lib/copy";

type Cycle = "monthly" | "yearly";

const FEATURE_EMOJIS = ["🏆","⚙️","🧠","🔥","🎧","📁","🔄","🤝","🪙","🎁"];

export default function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  const price =
    cycle === "monthly" ? copy.pricing.monthly.price : copy.pricing.yearly.price;
  const label =
    cycle === "monthly" ? copy.pricing.monthly.label : copy.pricing.yearly.label;

  return (
    <section id="planes" aria-labelledby="pricing-title" className="bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="pricing-title" className="text-3xl md:text-4xl">{copy.pricing.title}</h2>

          {/* Toggle Mensual/Anual */}
          <div className="mt-6 inline-flex overflow-hidden rounded-xl border border-border">
            <button
              type="button"
              aria-pressed={cycle === "monthly"}
              onClick={() => setCycle("monthly")}
              className={`px-4 py-2 text-sm ${cycle === "monthly" ? "bg-panel text-text" : "bg-ink text-muted hover:text-text"}`}
            >
              {copy.pricing.monthly.label}
            </button>
            <button
              type="button"
              aria-pressed={cycle === "yearly"}
              onClick={() => setCycle("yearly")}
              className={`px-4 py-2 text-sm border-l border-border ${cycle === "yearly" ? "bg-panel text-text" : "bg-ink text-muted hover:text-text"}`}
            >
              {copy.pricing.yearly.label}
            </button>
          </div>
        </div>

        {/* Card de precio */}
        <div className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-2xl border border-border bg-panel p-6">
            <div className="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
              <div>
                <p className="text-sm text-muted">Plan {label}</p>
                <p className="mt-1 text-4xl font-display">
                  ${price} <span className="text-base text-muted">USD</span>
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <Link
                  href="/subscribe"
                  className="inline-flex items-center rounded-xl border border-emerald bg-emerald/15 px-5 py-2.5 text-sm font-medium hover:brightness-110"
                >
                  {copy.pricing.cta}
                </Link>
              </div>
            </div>

            {/* Features (10) con emoji */}
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {copy.pricing.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-7 place-items-center rounded-lg border border-border bg-ink/40 text-sm"
                    title="feature"
                  >
                    {FEATURE_EMOJIS[i % FEATURE_EMOJIS.length]}
                  </span>
                  <span className="text-sm text-text/90">{f}</span>
                </li>
              ))}
            </ul>

            {/* Nota ahorro al seleccionar Anual */}
            {cycle === "yearly" && (
              <p className="mt-4 text-center text-xs text-muted">
                Pagas ${copy.pricing.yearly.price} en un solo pago. Ahorra ~20% vs mensual.
              </p>
            )}
          </div>
        </div>

        {/* CTA secundaria bajo la card */}
        <div className="mt-6 text-center">
          <Link href="/subscribe" className="underline underline-offset-4 text-muted hover:text-text">
            ¿Dudas? Conoce el detalle del acceso premium
          </Link>
        </div>
      </div>
    </section>
  );
}
