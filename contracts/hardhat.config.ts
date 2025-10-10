import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });

const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://testnet-passet-hub-eth-rpc.polkadot.io";
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 420420422);
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 }, viaIR: true },
  },
  networks: {
    paseo: {
      url: RPC,
      chainId: CHAIN_ID,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
      gasPrice: 2_000_000_000, // baseline (puede ignorarse si la tx usa type:2)
    },
  },
  etherscan: { apiKey: "" },
};

export default config;
