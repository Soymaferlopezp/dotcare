type Props = {
  value: string;
  onChange: (v: string) => void;
  validFormat: boolean;
  onApply: () => void;
  applyDisabled: boolean;
  errorText: string | null;
};

export default function CouponField({
  value, onChange, validFormat, onApply, applyDisabled, errorText,
}: Props) {
  return (
    <section
      id="coupon-field"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
    >
      <h3 className="text-sm font-semibold">Cupón</h3>
      <div className="mt-3 flex gap-2">
        <input
          id="coupon-input"
          placeholder="Código de cupón"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          aria-invalid={!validFormat}
          className={`w-full rounded-lg border px-3 py-2 text-sm
                      bg-white dark:bg-zinc-950
                      ${validFormat ? "border-zinc-300 dark:border-zinc-700" : "border-red-500"}`}
        />
        <button
          id="coupon-apply"
          className={`rounded-lg border px-4 text-sm
                      border-zinc-300 hover:bg-white
                      dark:border-zinc-700 dark:hover:bg-zinc-800
                      ${applyDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          onClick={onApply}
          disabled={applyDisabled}
          title={applyDisabled ? "Completa el código válido y espera la sesión" : "Aplicar cupón"}
        >
          Aplicar
        </button>
      </div>
      <p id="coupon-helper" className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        Formato permitido: A–Z, números y “-”, 3–24 caracteres.
      </p>
      {!validFormat && <p className="mt-1 text-xs text-red-600 dark:text-red-400">El formato del cupón no es válido.</p>}
      {errorText && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errorText}</p>}
    </section>
  );
}
