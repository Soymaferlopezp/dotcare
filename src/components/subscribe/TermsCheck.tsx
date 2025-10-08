import Link from "next/link";

type Props = { checked: boolean; onChange: (v: boolean) => void };

export default function TermsCheck({ checked, onChange }: Props) {
  return (
    <section
      id="terms-check"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
    >
      <label className="flex items-start gap-3 text-sm">
        <input
          id="agree-terms"
          type="checkbox"
          className="mt-0.5"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          I agree to the{" "}
          <Link href="#" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">
            terms of service
          </Link>{" "}
          and have read the{" "}
          <Link href="#" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">
            privacy policy
          </Link>.
        </span>
      </label>
    </section>
  );
}
