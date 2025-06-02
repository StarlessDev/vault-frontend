import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Vault",
  description: "Protect important files with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html className="scroll-smooth" suppressHydrationWarning>
        <head />
        <body>
          <AuthProvider>
            <Toaster />
            {children}
          </AuthProvider>
        </body>
      </html>
    </>
  );
}
