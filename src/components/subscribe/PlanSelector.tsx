import type { Plan } from "@/lib/pricing";

type Props = { plan: Plan; onChange: (p: Plan) => void };

export default function PlanSelector({ plan, onChange }: Props) {
  return (
    <section
      id="plan-selector"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
    >
      <h3 className="text-sm font-semibold">Selecciona tu plan</h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block cursor-pointer rounded-xl border p-4 border-zinc-300 hover:border-zinc-500
                           dark:border-zinc-700 dark:hover:border-zinc-500">
          <input
            type="radio"
            name="plan"
            value="monthly"
            checked={plan === "monthly"}
            onChange={() => onChange("monthly")}
            className="mr-2"
          />
          <span className="font-medium">$20 / mensual</span>
        </label>

        <label className="block cursor-pointer rounded-xl border p-4 border-zinc-300 hover:border-zinc-500
                           dark:border-zinc-700 dark:hover:border-zinc-500">
          <input
            type="radio"
            name="plan"
            value="yearly"
            checked={plan === "yearly"}
            onChange={() => onChange("yearly")}
            className="mr-2"
          />
          <span className="font-medium">$144 / anual</span>
          <div className="mt-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <strong>Suscripción anual — Ahorra 5 meses</strong>
          </div>
        </label>
      </div>
    </section>
  );
}
