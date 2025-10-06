import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "DOTCARE",
  description: "Token-gated wellness platform for Web3 builders",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
