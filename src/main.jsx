import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { WalletProvider } from "./wallet/WalletProvider.jsx";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
