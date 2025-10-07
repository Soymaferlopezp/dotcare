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
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/subscribe"
              className="inline-flex items-center rounded-xl border border-emerald bg-emerald/15 px-5 py-2.5 text-sm font-medium text-text shadow-[0_0_32px_0_var(--emerald)] hover:brightness-110"
            >
              {copy.hero.cta}
            </Link>

          </div>
        </div>

        {/* Lado derecho: placeholder visual (se reemplazará más adelante) */}
        <div className="md:col-span-5">
          <div className="rounded-2xl border border-border bg-panel p-6 text-sm text-muted">
            <p className="font-mono">
              Promesa: “Estructura mental + hábitos medibles para sostener el ritmo builder”.
            </p>
            <ul className="mt-3 list-disc pl-5">
              <li>Token-gating</li>
              <li>Rituales y métricas personales</li>
              <li>Deep work sin FOMO</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
