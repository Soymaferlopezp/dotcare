import { copy } from "../lib/copy";

// 10 emojis (uno por ítem). Si cambian la cantidad, se ciclan.
const BENEFIT_EMOJIS = ["⚡","🎯","🛡️","🌙","📈","🔁","🗣️","📊","📚","💪"];

export default function BenefitsSection() {
  return (
    <section id="beneficios" aria-labelledby="benefits-title" className="bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="benefits-title" className="text-3xl md:text-4xl">{copy.benefits.title}</h2>
          <p className="mt-3 text-muted">{copy.benefits.subtitle}</p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {copy.benefits.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-panel p-4"
            >
              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-lg border border-border bg-ink/40 text-base"
                title="beneficio"
              >
                {BENEFIT_EMOJIS[i % BENEFIT_EMOJIS.length]}
              </span>
              <span className="text-sm text-text/90">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
