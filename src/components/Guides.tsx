export default function Guides() {
  return (
    <section aria-labelledby="guides-title" className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="guides-title" className="text-3xl md:text-4xl">Recibe 2 guías gratuitas</h2>
          <p className="mt-2 text-sm text-muted">Empieza hoy a blindar tu foco y a filtrar el ruido</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* Guía 1 */}
          <article className="group flex flex-col rounded-2xl border border-border bg-panel p-6 hover:shadow-[0_0_28px_0_var(--cyan)]">
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-xl">📵</div>
              <div>
                <h3 className="text-lg font-semibold">El “Modo Avión” para Builders</h3>
                <p className="mt-1 text-sm text-muted">Cómo blindar tu mente de las notificaciones 24/7.</p>
              </div>
            </div>
            <div className="mt-5">
              <a
                href="/guides/guia_modo_avion.pdf"
                download
                className="inline-flex items-center rounded-xl border border-emerald bg-emerald/15 px-4 py-2 text-sm font-medium hover:brightness-110"
              >
                ⬇️ Descargar PDF
              </a>
            </div>
          </article>

          {/* Guía 2 */}
          <article className="group flex flex-col rounded-2xl border border-border bg-panel p-6 hover:shadow-[0_0_28px_0_var(--magenta)]">
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-xl">🧹</div>
              <div>
                <h3 className="text-lg font-semibold">Dieta Mental Anti-FOMO</h3>
                <p className="mt-1 text-sm text-muted">Filtra narrativas tóxicas y rug pulls informativos.</p>
              </div>
            </div>
            <div className="mt-5">
              <a
                href="/guides/guia_dieta_anti_fomo.pdf"
                download
                className="inline-flex items-center rounded-xl border border-emerald bg-emerald/15 px-4 py-2 text-sm font-medium hover:brightness-110"
              >
                ⬇️ Descargar PDF
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
