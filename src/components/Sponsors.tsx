import { copy } from "../lib/copy";

export default function Sponsors() {
  return (
    <section aria-labelledby="sponsors-title" className="bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <h2
          id="sponsors-title"
          className="text-center text-sm font-mono uppercase tracking-wider text-muted"
        >
          {copy.sponsors.title}
        </h2>

        <div
          className="mt-8 grid grid-cols-2 items-center justify-items-center gap-8 sm:gap-12"
          aria-label="Patrocinadores"
        >
          {/* NerdConf */}
          <a
            href="#"
            aria-label="NerdConf"
            className="group grid h-24 w-full place-items-center rounded-2xl border border-border bg-panel/60 p-4 transition hover:bg-panel"
          >
            {/* Light theme -> versión light */}
            <img
              src="/logos/nerdconf_light.png"
              alt="NerdConf"
              className="block h-12 dark:hidden opacity-90 transition group-hover:opacity-100"
            />
            {/* Dark theme -> versión dark */}
            <img
              src="/logos/nerdconf_dark.png"
              alt="NerdConf"
              className="hidden h-12 dark:block opacity-90 transition group-hover:opacity-100"
            />
          </a>

          {/* Polkadot */}
          <a
            href="#"
            aria-label="Polkadot"
            className="group grid h-24 w-full place-items-center rounded-2xl border border-border bg-panel/60 p-4 transition hover:bg-panel"
          >
            {/* Light theme -> versión light */}
            <img
              src="/logos/polkadot_light.png"
              alt="Polkadot"
              className="block h-12 dark:hidden opacity-90 transition group-hover:opacity-100"
            />
            {/* Dark theme -> versión dark */}
            <img
              src="/logos/polkadot_dark.png"
              alt="Polkadot"
              className="hidden h-12 dark:block opacity-90 transition group-hover:opacity-100"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
