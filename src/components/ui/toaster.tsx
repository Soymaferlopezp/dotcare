"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      richColors
      theme="system"    // respeta darkMode por clase
      position="bottom-right"
      toastOptions={{ duration: 2500 }}
    />
  );
}
