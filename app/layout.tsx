import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ShoppingCartProvider } from "@/components/ShoppingCart";
import TopNav from "../components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
