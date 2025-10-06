/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Evita que Next infiera la raíz por lockfiles fuera del proyecto
  outputFileTracingRoot: process.cwd(),

  // Apaga dependencias no-web que arrastran SDKs innecesarios
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // MetaMask SDK intenta traer RN storage
      "@react-native-async-storage/async-storage": false,
      // WalletConnect logger intenta resolver pino-pretty (CLI)
      "pino-pretty": false,
      // Evita que se cuele el modal Web3Modal/Lit
      "@walletconnect/modal": false,
      "@web3modal/wallet": false,
      "@web3modal/core": false,
    };
    return config;
  },
};

export default nextConfig;
