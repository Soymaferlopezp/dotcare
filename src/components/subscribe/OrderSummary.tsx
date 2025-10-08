type Props = { totalText: string; nextChargeText: string; onOpenDetails: () => void };

export default function OrderSummary({ totalText, nextChargeText, onOpenDetails }: Props) {
  return (
    <section
      id="order-summary"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
    >
      <div className="flex items-start justify-between">
        <div className="text-sm text-zinc-600 dark:text-zinc-300">
          Total due today ·{" "}
          <button
            id="order-details-trigger"
            className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100"
            aria-haspopup="dialog"
            onClick={onOpenDetails}
          >
            Ver detalles de la orden
          </button>
        </div>
        <div className="text-lg font-semibold">{totalText}</div>
      </div>

      <p id="next-charge" className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        {nextChargeText}
      </p>
    </section>
  );
}
