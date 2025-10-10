"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

/**
 * BYPASS TEMPORAL: mientras resolvemos suscripción.
 * Setea DEV_BYPASS a true para desactivar el redirect.
 * Al final del proyecto, cambia a false y restaura la verificación real.
 */
const DEV_BYPASS = true;

export function useSubscriptionStatus() {
  const { address, isConnected } = useAccount();
  // Mock temporal: en producción se valida en Supabase
  const isActive = !!address && address.endsWith("E");
  return { address, isConnected, isActive };
}

export function useProtectedRoute() {
  const router = useRouter();
  const { isConnected, isActive } = useSubscriptionStatus();

  useEffect(() => {
    if (DEV_BYPASS) return;
    if (!isConnected || !isActive) router.push("/subscribe");
  }, [isConnected, isActive, router]);

  // si bypass, nos comportamos como activos
  return DEV_BYPASS ? { isConnected: true, isActive: true } : { isConnected, isActive };
}
