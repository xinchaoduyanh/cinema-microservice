
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Volume2, Music, Waves, ShieldCheck } from "lucide-react";

export function AtmosphericSound() {
  return (
    <section className="w-full py-32 px-6 md:px-12 relative overflow-hidden bg-black border-y border-white/5">
      {/* Decorative Sound Waves Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="500" cy="500" r="100" stroke="white" fill="none" />
          <circle cx="500" cy="500" r="200" stroke="white" fill="none" />
          <circle cx="500" cy="500" r="300" stroke="white" fill="none" />
          <circle cx="500" cy="500" r="400" stroke="white" fill="none" />
        </svg>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-24">
        {/* Visualizer Side */}
        <div className="relative aspect-square glass rounded-[3rem] overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          {/* Animated "Pulsing" Speaker Core */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-white/10 flex items-center justify-center relative"
          >
            <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl animate-pulse" />
            <Volume2 className="w-16 h-16 text-white/40" />
            
            {/* Small floating particles/nodes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                animate={{
                  x: [0, Math.cos(i * 45) * 150],
                  y: [0, Math.sin(i * 45) * 150],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 glass rounded-full text-[10px] uppercase font-bold tracking-[.3em] opacity-40">
            Scanning frequencies...
          </div>
        </div>

        {/* Text/Content Side */}
        <div className="space-y-12">
          <div>
            <span className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">The Audio Engine</span>
            <h2 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter uppercase leading-[0.85] mb-8">
              Hear <br />In <br />360°
            </h2>
            <p className="text-xl text-white/40 font-light leading-relaxed max-w-md italic">
              "We don't just screen movies; we resonate them. Every whisper, every explosion, delivered with surgical precision."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <Music className="w-5 h-5 text-white/40" />
                <h4 className="font-bold uppercase text-xs tracking-widest">Dolby Atmos</h4>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                Object-based spatial audio that surrounds you from every direction, including overhead.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <ShieldCheck className="w-5 h-5 text-white/40" />
                <h4 className="font-bold uppercase text-xs tracking-widest">THX Certified</h4>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                The highest standard for cinematic sound playback, ensuring you hear exactly what the director intended.
              </p>
            </div>
          </div>

          <button className="px-10 py-5 border border-white/10 hover:bg-white hover:text-black transition-all rounded-full text-[10px] uppercase font-bold tracking-widest">
            Experience the sound
          </button>
        </div>
      </div>
    </section>
  );
}
