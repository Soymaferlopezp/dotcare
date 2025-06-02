import React from 'react';
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const PAS_TESTNET = {
  id: 420420421,
  name: 'PAS Testnet',
  nativeCurrency: { name: 'PAS', symbol: 'PAS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-passet-hub.parity-testnet.parity.io/',
    },
  },
};

const config = getDefaultConfig({
  appName: 'DOTCARE',
  projectId: 'dotcare-hackathon',
  chains: [PAS_TESTNET],
  transports: {
    [PAS_TESTNET.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WalletProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={[PAS_TESTNET]}
          modalSize="compact"
          theme={darkTheme()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
