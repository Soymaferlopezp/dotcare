"use client";
import { copy } from "../lib/copy";

const EMOJIS = ["💬","🚀","🎤"]; // se cicla si hay más

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl">{copy.testimonials.title}</h2>
          <p className="mt-2 text-sm text-muted">Historias reales de la comunidad</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {copy.testimonials.items.map((t, i) => (
            <article
              key={i}
              className="group rounded-2xl border border-border bg-panel p-5 transition hover:-translate-y-0.5 hover:shadow-[0_0_28px_0_var(--violet)]"
            >
              <div className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-surface text-xl"
                  title="testimonio"
                >
                  {EMOJIS[i % EMOJIS.length]}
                </div>
                <div>
                  <p className="text-sm text-text/90">“{t.text}”</p>
                  <p className="mt-2 text-xs text-muted">— <strong className="text-text/90">{t.name}</strong></p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
