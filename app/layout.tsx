import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/hooks/use-cart";
import { FavoritesProvider } from "@/hooks/use-favorites";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChuteirasPro - Chuteiras Profissionais de Primeira Linha",
  description:
    "Loja especializada em chuteiras profissionais para futsal, society e campo. Nike, Adidas, Puma, Mizuno e muito mais.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ChuteirasPro - Chuteiras Profissionais",
      },
    ],
  },
  keywords: "chuteiras, futsal, society, campo, nike, adidas, puma, mizuno",
  generator: "Gabriel Belchior",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
