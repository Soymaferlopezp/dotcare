import Link from "next/link";

export const metadata = { title: "DOTCARE — Subscribe" };

export default function Layout({ children }: { children: React.ReactNode }) {
  // Layout SOLO para la ruta /subscribe
  return (
    <section className="mx-auto max-w-6xl px-3">
      {/* Header local de /subscribe (no toca tu layout global) */}
      <div className="h-12 flex items-center justify-between border-b border-neutral-800 mb-6">
        <div />
      </div>

      {children}
    </section>
  );
}
