import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import Header from "@/components/atoms/header";

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
      <html className="scroll-smooth">
        <head />
        <body>
          <Header />
          <Toaster />
          {children}
        </body>
      </html>
    </>
  );
}
