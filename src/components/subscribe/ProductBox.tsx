export default function ProductBox() {
  return (
    <section
      id="product-box"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
      aria-labelledby="product-title"
    >
      <h2 id="product-title" className="text-base font-medium">
        Membresía Pro | DOTCARE
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        La membresía todo incluido para cuidar tu salud y bienestar mental de verdad. Acceso total a
        cursos, guías rápidas (agregadas cada 2 semana), tips, retos, workshops y recomendaciones de herramientas.
      </p>
    </section>
  );
}
