
"use client";

import React from "react";
import { Home, Search, Ticket, User } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Ticket, label: "Tickets", href: "/tickets" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Top Navbar - Minimalist */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 hidden md:flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-white">
          AESTHETIX<span className="text-white/40">CINEMAS</span>
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm uppercase tracking-widest transition-colors hover:text-white",
                pathname === item.href ? "text-white" : "text-white/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
        <div className="glass rounded-full px-6 py-4 flex items-center justify-between shadow-2xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative">
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive ? "text-white scale-110" : "text-white/40 hover:text-white/60"
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
