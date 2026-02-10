
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AESTHETIX | Immersive Cinema Experience",
  description: "European Modernism meets Cinematic Excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} antialiased selection:bg-white selection:text-black overflow-x-hidden min-h-screen relative`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
