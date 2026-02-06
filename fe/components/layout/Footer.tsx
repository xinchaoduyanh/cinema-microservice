
import React from "react";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <h2 className="text-xl font-serif font-bold tracking-tighter">AESTHETIX</h2>
          <p className="text-white/40 text-sm">© 2024 Aesthetix Cinema Group. All rights reserved.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-white/40 hover:text-white transition-colors">
            <Youtube className="w-5 h-5" />
          </a>
        </div>
        
        <div className="flex gap-8 text-xs uppercase tracking-widest text-white/40">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Press</a>
        </div>
      </div>
    </footer>
  );
}
