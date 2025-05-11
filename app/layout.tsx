"use client";

import "./globals.css";
import { ShoppingCartProvider } from "@/components/ShoppingCart";
import TopNav from "../components/TopNav";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <SessionProvider>
          <ShoppingCartProvider>
            <TopNav />
            <main className="flex-col container mx-auto px-4 py-8">
              {children}
            </main>
          </ShoppingCartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
