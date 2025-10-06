"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Placeholder de área premium (token-gated)
 * - En PASO 7/8 montaremos verificación: wallet conectada + (NFT/token) o plan activo.
 */
export default function PremiumPage() {
  const [status, setStatus] = useState<"locked" | "checking" | "open">("locked");

  const simulateCheck = async () => {
    setStatus("checking");
    // TODO: aquí vendrá la validación real (wagmi/viem + Supabase)
    await new Promise((r) => setTimeout(r, 800));
    setStatus("open");
    toast.success("Acceso temporal simulado.");
  };

  return (
    <main className="min-h-dvh px-6 py-10 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Área Premium</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Contenido exclusivo para holders / suscriptores (token-gated).
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Estado de acceso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {status === "locked" && (
              <>
                <p className="text-sm">
                  Acceso bloqueado. Conecta tu wallet y valida tu plan.
                </p>
                <div className="flex gap-2">
                  <Button onClick={simulateCheck}>Validar acceso</Button>
                  <Button variant="outline" asChild>
                    <a href="/subscribe">Ir a suscripción</a>
                  </Button>
                </div>
              </>
            )}

            {status === "checking" && <p className="text-sm">Verificando credenciales on-chain…</p>}

            {status === "open" && (
              <div className="space-y-2">
                <p className="text-sm">🎉 Acceso concedido (demo).</p>
                <ul className="list-disc pl-5 text-sm text-zinc-300">
                  <li>Rutinas y protocolos premium</li>
                  <li>Sesiones en vivo</li>
                  <li>Integraciones exclusivas</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
