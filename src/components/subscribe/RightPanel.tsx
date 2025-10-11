// src/components/subscribe/RightPanel.tsx
"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

type Props = {
  onConfirmTransfer: () => void;
  confirming: boolean;
  confirmError: string | null;
  contractUrl: string;
  txUrl?: string | null;
};

export default function RightPanel(_props: Props) {
  const ADDRESS = "0x90B3EA700173274560182CbF76ED8E6E66Ad2494";
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    const input = document.createElement("input");
    input.type = "text";
    input.value = ADDRESS;
    input.style.position = "fixed";
    input.style.top = "-100px";
    input.style.left = "-100px";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";
    document.body.appendChild(input);

    input.focus();
    input.select();
    input.setSelectionRange(0, ADDRESS.length);

    let success = false;
    try { success = document.execCommand("copy"); } catch {}
    document.body.removeChild(input);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(ADDRESS)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
        .catch(() => alert("No se pudo copiar. Copia manualmente."));
    } else {
      alert("No se pudo copiar. Copia manualmente.");
    }
  }

  return (
    <aside className="space-y-6">
      {/* Tarjeta principal (light limpio + dark) */}
      <div className="rounded-2xl border bg-white border-zinc-200 shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800 p-6">
        {/* SIEMPRE visible: ConnectButton centrado */}
        <div className="flex justify-center">
          <ConnectButton />
        </div>

        <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Conecta tu wallet para realizar la suscripción on-chain.
        </p>

        {/* QR + dirección + copiar */}
        <div className="mt-6 space-y-3">
          <h3 className="text-center text-base font-semibold">Escanea el código QR</h3>
          <div className="flex justify-center">
            <Image
              src="/pay/treasury-qr.png"
              alt="QR de la tesorería Dotcare"
              width={200}
              height={200}
              priority
              className="rounded-lg border bg-white border-zinc-200 dark:bg-transparent dark:border-zinc-800"
            />
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 text-sm">
            <div className="rounded-lg border bg-white border-zinc-200 px-3 py-2 dark:bg-zinc-900/40 dark:border-zinc-700">
              <span className="font-mono text-xs sm:text-sm break-all select-all text-zinc-800 dark:text-zinc-200">
                {ADDRESS}
              </span>
            </div>

            <button
              type="button"
              onClick={copyAddress}
              className="inline-flex items-center gap-2 rounded-lg border bg-white border-zinc-200 px-3 py-2 hover:border-zinc-300 transition dark:bg-transparent dark:border-zinc-700 dark:hover:border-zinc-600"
              title="Copiar dirección"
              aria-label="Copiar dirección"
            >
              {copied ? "✅" : "📋"} {copied ? "Copiado" : "Copiar"}
            </button>
          </div>

          {copied && (
            <p className="text-center text-xs text-emerald-600 dark:text-emerald-400">
              ¡Dirección copiada!
            </p>
          )}
        </div>
      </div>

      {/* Datos de red */}
      <div className="rounded-2xl border bg-white border-zinc-200 shadow-sm dark:bg-zinc-900/60 dark:border-zinc-800 p-5 space-y-3">
        <h3 className="text-base font-semibold">Datos de la red PASEO</h3>
        <ul className="list-disc list-inside text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
          <li>Chain ID: 420420422</li>
          <li>RPC: https://testnet-passet-hub-eth-rpc.polkadot.io</li>
        </ul>
        <div className="pt-2 flex flex-col gap-1.5 text-xs">
          <a className="underline underline-offset-4 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white" href="https://faucet.polkadot.io/?parachain=1111" target="_blank" rel="noreferrer">
            ¿Necesitas tokens $PAS? — Faucet oficial de Polkadot
          </a>
          <a className="underline underline-offset-4 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white" href="https://metamask.io/es" target="_blank" rel="noreferrer">
            ¿No tienes Wallet? — MetaMask (sitio oficial)
          </a>
        </div>
      </div>
    </aside>
  );
}
