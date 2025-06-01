// src/components/MintButton.jsx
import React, { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { CONTRACT_ABI } from "../constants/contractAbi";
import { CONTRACT_ADDRESS } from "../constants/contractAddress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MintButton = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { readContract } = useReadContract();
  const [isMinting, setIsMinting] = useState(false);
  const navigate = useNavigate();

  const handleMint = async () => {
    if (!isConnected) {
      toast.error("Conecta tu wallet para continuar ✨");
      return;
    }

    setIsMinting(true);
    toast("Verificando elegibilidad para mintear...");

    try {
  console.log("Minting...");
  setIsMinting(true);

  const { hash } = await writeContract({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "mintBadge",
  });

  toast.success("¡Mint exitoso! Verifica tu transacción.", {
    description: `Hash: ${hash}`,
  });

  // Aquí se podría redirigir al dashboard/logros
  // navigate('/Dashboard#logros');

  setIsMinting(false);
} catch (err) {
  console.error("Error en mint:", err);
  toast.error("❌ Error al mintear. Ya tienes tu Badge.");
  setIsMinting(false);
}
  };

  return (
    <button
      className="finishButton"
      onClick={handleMint}
      disabled={isMinting}
    >
      {isMinting ? "Minting..." : "Terminé mi sesión"}
    </button>
  );
};

export default MintButton;

