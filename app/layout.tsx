import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

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
      <html className="scroll-smooth" lang="en" suppressHydrationWarning>
        <head />
        <body>
          {children}
          <Toaster />
        </body>
      </html>
    </>
  );
}
