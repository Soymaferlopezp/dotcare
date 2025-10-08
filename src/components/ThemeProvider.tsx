"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Unificamos:
  // - attribute="class"   -> pone "light" o "dark" en <html>
  // - defaultTheme="dark" -> por defecto oscuro (match con :root de tokens.css)
  // - enableSystem={false} (evitamos auto-cambio por sistema)
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
