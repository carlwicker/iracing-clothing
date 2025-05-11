import type { Metadata } from "next";
import "./globals.css";
import { ShoppingCartProvider } from "@/components/ShoppingCart";
import TopNav from "../components/TopNav";

export const metadata: Metadata = {
  title: "Iracing Clothing",
  description: "Iracing Clothing Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <ShoppingCartProvider>
          <TopNav />
          <main className="flex-col container mx-auto px-4 py-8">
            {children}
          </main>
        </ShoppingCartProvider>
      </body>
    </html>
  );
}
