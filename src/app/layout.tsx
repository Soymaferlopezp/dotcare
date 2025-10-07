import "./globals.css";
import "./tokens.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import SkipLink from "../components/SkipLink";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata = {
  title: "DOTCARE — Estructura mental + hábitos medibles",
  description: "Bienestar premium token-gated para builders, devs y traders Web3.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} min-h-dvh`}>
        <ThemeProvider>
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
