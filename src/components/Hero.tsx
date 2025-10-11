import Link from "next/link";
import { copy } from "../lib/copy";

export default function Hero() {
  return (
    <section className="bg-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-5 py-14 md:grid-cols-12">
        <div className="md:col-span-7">
          <h1 className="font-display text-4xl leading-tight text-text md:text-5xl">
            {copy.hero.title}
          </h1>
          <p className="mt-3 max-w-prose text-base text-muted md:text-lg">
            {copy.hero.subtitle}
          </p>

          {/* Wrapper con clase 'cta-swap' para controlar el intercambio de glow */}
          <div className="cta-swap mt-6 flex flex-wrap items-center gap-3">
            {/* CTA principal con glow por defecto (emerald) */}
            <Link
              href="/subscribe"
              className="cta-primary inline-flex items-center rounded-xl border border-emerald bg-emerald/15 px-5 py-2.5 text-sm font-medium text-text shadow-[0_0_32px_0_var(--emerald)] transition hover:brightness-110"
            >
              {copy.hero.cta}
            </Link>

            {/* DEMO — mismo borde/fondo/shine (emerald); al interactuar se lleva el glow */}
            <Link
              href="/premium"
              className="demo inline-flex items-center rounded-xl border border-emerald bg-emerald/15 px-5 py-2.5 text-sm font-medium text-text transition hover:brightness-110 hover:shadow-[0_0_28px_0_var(--emerald)] focus-visible:shadow-[0_0_28px_0_var(--emerald)]"
              title="Entrar al demo sin pago (vista en modo observador)"
            >
              💻 Demo
            </Link>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-muted">
            <p className="font-mono">
              Promesa: Mental framework + hábitos medibles para construir sin colapsar.
            </p>
            <ul className="mt-3 list-disc pl-5">
              <li>Acceso por progreso, no por hype</li>
              <li>Rituales y métricas personales</li>
              <li>Deep work sin FOMO</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
