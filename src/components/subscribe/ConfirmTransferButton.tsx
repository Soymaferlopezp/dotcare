type Props = {
  disabled: boolean;
  loading: boolean;
  errorText: string | null;
  onConfirm: () => void;
};

export default function ConfirmTransferButton({
  disabled, loading, errorText, onConfirm,
}: Props) {
  return (
    <div
      id="confirm-transfer-wrapper"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
    >
      <button
        id="confirm-transfer"
        className={`w-full rounded-lg border px-4 py-2 text-sm font-semibold
                    border-zinc-300 hover:bg-white
                    dark:border-zinc-700 dark:hover:bg-zinc-800
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={onConfirm}
      >
        {loading ? "Confirmando..." : "Transferencia realizada"}
      </button>

      {errorText && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errorText}</p>}

      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        En Hito 2, este botón marca la sesión como <em>ready_for_chain</em> (off-chain). Luego te
        redirigimos a <code>/subscribe/success?sessionId=...</code>.
      </p>
    </div>
  );
}
