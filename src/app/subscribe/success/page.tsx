import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

// Evita SSG/ISR para esta ruta
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
          <p className="text-sm text-zinc-300">Cargando…</p>
        </main>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}
