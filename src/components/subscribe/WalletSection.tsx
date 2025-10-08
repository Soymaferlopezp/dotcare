"use client";

import { useRef } from "react";

export default function WalletSection() {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onError = () => {
    if (!imgRef.current) return;
    const svg = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>
        <rect width='100%' height='100%' fill='#ffffff'/>
        <g fill='#475569' font-family='monospace' font-size='14'>
          <text x='16' y='40'>QR no encontrado</text>
          <text x='16' y='70'>Coloca: public/pay/treasury-qr.png</text>
        </g>
        <rect x='16' y='100' width='288' height='200' fill='none' stroke='#e4e4e7' stroke-width='2'/>
      </svg>`
    );
    imgRef.current.src = `data:image/svg+xml;charset=utf-8,${svg}`;
  };

  return (
    <section
      id="wallet-section"
      className="rounded-2xl border p-5 border-zinc-200 bg-white/70 text-zinc-900
                 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100"
    >
      <h3 className="text-sm font-semibold">Tu cuenta</h3>

      <div className="mt-3">
        <button
          id="wallet-connect-placeholder"
          className="w-full rounded-lg border px-4 py-2 text-sm
                     border-zinc-300 hover:bg-white
                     dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Conectar Wallet (placeholder)
        </button>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold">Wallet address (destino)</h4>
        <p id="treasury-address" className="mt-1 select-all text-xs text-zinc-600 dark:text-zinc-300">
          {process.env.NEXT_PUBLIC_TREASURY_ADDRESS ?? "0x90B3EA700173274560182CbF76ED8E6E66Ad2494"}
        </p>

        <div className="mt-4">
          <h5 className="text-sm font-medium">Escanéalo con tu wallet</h5>
          <div className="mt-2 overflow-hidden rounded-xl border p-3
                          border-zinc-200 bg-white
                          dark:border-zinc-800 dark:bg-zinc-950">
            <img
              id="treasury-qr"
              ref={imgRef}
              src="/pay/treasury-qr.png"
              alt="QR de la tesorería"
              width={320}
              height={320}
              onError={onError}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
