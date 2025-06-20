import React, { useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CONTRACT_ABI } from "../constants/contractAbi";
import { CONTRACT_ADDRESS } from "../constants/contractAddress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MintButton = () => {
  const { address } = useAccount();
  const { data: hasMinted, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasMinted",
    args: [address],
  });

  const { writeContractAsync } = useWriteContract();
  const [isMinting, setIsMinting] = useState(false);
  const navigate = useNavigate();

  const handleMint = async () => {
    if (!address) {
      toast.error("Conecta tu wallet primero");
      return;
    }

    if (hasMinted) {
      toast.error("Error al mintear. Ya tienes tu Badge.");
      return;
    }

    try {
      setIsMinting(true);
      toast("Minting...");

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "mintBadge",
        args: [],
      });

      await refetch();

      toast.success("¡Mint exitoso! Verifica tu transacción.", {
        description: `Hash: ${txHash}`,
      });

      setTimeout(() => {
        navigate("/dashboard#logros");
      }, 2000);
    } catch (error) {
      console.error("Error en mint:", error);
      toast.error("Hubo un problema al mintear. Intenta de nuevo.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
<button
  onClick={handleMint}
  disabled={isMinting}
  style={{
    backgroundColor: "#6f4aad",
    color: "white",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    cursor: isMinting ? "not-allowed" : "pointer",
    marginTop: "2rem",
    opacity: isMinting ? 0.6 : 1,
    transition: "all 0.3s ease",
  }}
>
  {isMinting ? "Minting..." : "Terminé mi sesión"}
</button>

  );
};

export default MintButton;
