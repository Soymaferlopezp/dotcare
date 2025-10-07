import Link from "next/link";
import { copy } from "../lib/copy";

const EMOJIS = ["✨","📘","🧭"]; // 3 cards → asignamos fijos

export default function OpportunitySection() {
  return (
    <section aria-labelledby="op-title" className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="op-title" className="text-3xl md:text-4xl">{copy.opportunity.title}</h2>
          <p className="mt-3 text-muted">{copy.opportunity.subtitle}</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {copy.opportunity.cards.map((c, i) => (
            <article
              key={i}
              className="group flex flex-col rounded-2xl border border-border bg-panel p-6 transition hover:-translate-y-0.5 hover:shadow-[0_0_28px_0_var(--cyan)]"
            >
              <div className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-xl"
                  title={c.title}
                >
                  {EMOJIS[i] ?? "✨"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted">{c.text}</p>
                </div>
              </div>

              {/* CTA: si viene en copy, úsalo; si no, mostramos un CTA genérico a /subscribe */}
              <div className="mt-5">
                <Link
                  href={c.href ?? "/subscribe"}
                  className="inline-flex items-center rounded-xl border border-emerald bg-emerald/15 px-4 py-2 text-sm font-medium hover:brightness-110"
                >
                  {c.cta ?? "Ver Planes"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
