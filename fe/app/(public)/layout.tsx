
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundEffect } from "@/components/layout/BackgroundEffect";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BackgroundEffect />
      <Navbar />
      <main className="relative z-10 min-h-screen pt-20"> 
        {children}
      </main>
      <Footer />
    </>
  );
}
