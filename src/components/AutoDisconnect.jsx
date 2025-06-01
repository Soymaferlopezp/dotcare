// src/components/AutoDisconnect.jsx
import { useEffect } from "react";
import { useDisconnect } from "wagmi";

function AutoDisconnect() {
  const { disconnect } = useDisconnect();

  useEffect(() => {
    disconnect(); // Forzamos la desconexión al cargar
  }, []);

  return null;
}

export default AutoDisconnect;
