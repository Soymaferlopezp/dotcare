import { copy } from "../lib/copy";

const EMOJIS = ["🐼","🐻","🐻‍❄️"]; 

export default function Team() {
  return (
    <section id="equipo" aria-labelledby="team-title" className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="team-title" className="text-3xl md:text-4xl">{copy.team.title}</h2>
          <p className="mt-2 text-sm text-muted">Personas que cuidan el ritmo builder</p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {copy.team.members.map((m, i) => (
            <a
              key={i}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border bg-panel p-5 transition hover:-translate-y-0.5 hover:shadow-[0_0_24px_0_var(--emerald)]"
              aria-label={`Abrir perfil de ${m.name} en X`}
              title={`Abrir perfil de ${m.name} en X`}
            >
              <div className="flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="grid size-12 place-items-center rounded-xl border border-border bg-surface text-2xl"
                  title={`${m.name} — ${m.role}`}
                >
                  {EMOJIS[i % EMOJIS.length]}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text">{m.name}</h3>
                  <p className="text-sm text-muted">{m.role}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
