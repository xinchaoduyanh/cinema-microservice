import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cinema Admin - Quản lý rạp chiếu phim",
  description: "Hệ thống quản lý rạp chiếu phim - Admin Dashboard",
  keywords: ["cinema", "admin", "management", "dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
