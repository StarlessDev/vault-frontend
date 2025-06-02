import type { Metadata } from "next";

import "@/app/globals.css";
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
      <Header />
      {children}
    </>
  );
}
