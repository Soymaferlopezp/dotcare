import { copy } from "../lib/copy";

export default function ProblemSection() {
  return (
    <section aria-labelledby="problem-title" className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="problem-title" className="text-3xl md:text-4xl">{copy.problem.title}</h2>
          <p className="mt-3 text-muted">{copy.problem.subtitle}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {copy.problem.cards.map((c, i) => (
            <article
              key={i}
              className="group rounded-2xl border border-border bg-panel p-5 transition hover:-translate-y-0.5 hover:shadow-[0_0_32px_0_var(--magenta)]"
            >
              <div className="flex items-start gap-3">
                <div
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-xl"
                >
                  {c.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted">{c.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
