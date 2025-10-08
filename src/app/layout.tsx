import "./globals.css";
import "./tokens.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider"; // <- nuestro provider unificado (next-themes)
import SkipLink from "../components/SkipLink";
import ThemeFab from "@/components/ThemeFab";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata = {
  title: "DOTCARE — Estructura mental + hábitos medibles",
  description: "Bienestar premium token-gated para builders, devs y traders Web3.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* OJO: mantenemos las clases de variables de font en BODY */}
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} min-h-dvh`}>
        <ThemeProvider>
          {/* AHORA el FAB está DENTRO del ThemeProvider */}
          <ThemeFab />
          <Providers>
            <SkipLink />
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
