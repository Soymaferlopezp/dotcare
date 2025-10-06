"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-dvh px-6 py-10 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">DOTCARE</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">
              Bienestar premium con token-gating para builders Web3.
            </p>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline"><a href="/subscribe">/subscribe</a></Button>
              <Button asChild><a href="/premium">/premium</a></Button>
            </div>
          </div>
          <ConnectButton />
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Demo UI mínima</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="tu@email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={() => toast.success("Guardado ✅")}>Guardar</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="default" onClick={() => toast("Hola 👋")}>
                <Bell className="size-4" />
                Toast
              </Button>
              <Button variant="outline">Outline</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
