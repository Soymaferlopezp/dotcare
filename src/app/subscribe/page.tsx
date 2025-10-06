"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SubscribePage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // TODO: integrar Supabase (tabla newsletter) en PASO 7
    toast.success("Te avisaremos pronto. ✅");
    setEmail("");
  };

  return (
    <main className="min-h-dvh px-6 py-10 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold tracking-tight">Suscripción (free)</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Recibe novedades de DOTCARE y acceso temprano a features.
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Apúntate</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="tu@email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSubscribe}>Enviar</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
