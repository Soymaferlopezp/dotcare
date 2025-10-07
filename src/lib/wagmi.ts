"use client";

import { http } from "wagmi";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

/**
 * PASEO (Polkadot) – Passet Hub EVM Testnet
 */
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 420420422);
const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://testnet-passet-hub-eth-rpc.polkadot.io";

export const paseo = defineChain({
  id: CHAIN_ID,
  name: "Paseo (Polkadot) Testnet - Passet Hub",
  nativeCurrency: { name: "PASEO", symbol: "PASEO", decimals: 18 },
  rpcUrls: {
    default: { http: [RPC] },
    public: { http: [RPC] },
  },
  // (Opcional) añade explorer si tienes uno oficial
  // blockExplorers: { default: { name: "Explorer", url: "..." } },
});

export const wagmiConfig = getDefaultConfig({
  appName: "DOTCARE",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [paseo],
  transports: {
    [paseo.id]: http(RPC),
  },
  ssr: true,
});
