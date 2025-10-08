import { formatCentsUSD } from "@/lib/pricing";

type Props = {
  open: boolean;
  onClose: () => void;
  basePriceCents: number;
  discountBps: number; // En PASO 2: 0
  finalPriceCents: number;
};

export default function OrderDetailsModal({
  open,
  onClose,
  basePriceCents,
  discountBps,
  finalPriceCents,
}: Props) {
  if (!open) return null;

  const base = formatCentsUSD(basePriceCents);
  const discountLabel =
    discountBps > 0 ? `-${(discountBps / 100).toFixed(2)}%` : "$0.00";
  const finalText = formatCentsUSD(finalPriceCents);

  return (
    <div
      id="order-details-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Desglose de la orden"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-6"
    >
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Detalles de la orden</h4>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800"
            aria-label="Cerrar"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Precio base</span>
            <span>{base}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Descuento</span>
            <span>{discountLabel}</span>
          </div>
          <div className="mt-2 border-t border-zinc-800 pt-2 flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{finalText}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-400">
          Los cupones se validarán con el servidor en el PASO 4.
        </p>
      </div>
    </div>
  );
}
