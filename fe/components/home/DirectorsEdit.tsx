
"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function DirectorsEdit() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section className="relative w-full min-h-screen py-32 overflow-hidden flex flex-col md:flex-row items-center px-6 md:px-12 gap-16 max-w-[1600px] mx-auto">
      {/* Magazine Style Image */}
      <div className="flex-1 relative w-full aspect-[4/5] md:aspect-[3/4] rounded-sm overflow-hidden group">
        <motion.div style={{ scale: 1.1 }} whileHover={{ scale: 1.05 }} className="w-full h-full">
          <img 
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200" 
            alt="Director"
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
      </div>

      {/* Magazine Text */}
      <div className="flex-1 flex flex-col justify-center relative">
        <motion.div style={{ y }} className="absolute -top-40 -left-20 pointer-events-none opacity-[0.03]">
          <h2 className="text-[20rem] font-serif font-black uppercase leading-none italic">
            Vision
          </h2>
        </motion.div>

        <span className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold mb-6">Volume 01: The Artisans</span>
        
        <h3 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter mb-8 leading-[0.9] uppercase">
          The <br />Director's <br />Edit
        </h3>
        
        <blockquote className="border-l-2 border-white/20 pl-8 mb-12">
          <p className="text-xl md:text-2xl text-white/50 font-light italic leading-relaxed max-w-lg">
            "Cinema is a matter of what's in the frame and what's out. It's about how you see the world, not just how you capture it."
          </p>
          <cite className="block mt-4 text-xs font-bold uppercase tracking-widest text-white/40">— Jean-Luc Godard</cite>
        </blockquote>

        <p className="text-white/40 text-sm leading-relaxed max-w-md mb-8">
          Explore our curated selections of independent masterpieces and classic revivals. Each frame is selected with an uncompromising eye for aesthetic brilliance and narrative depth.
        </p>

        <button className="self-start text-[10px] uppercase font-bold tracking-[0.3em] pb-2 border-b border-white/20 hover:border-white transition-colors">
          View Collections
        </button>
      </div>
    </section>
  );
}
