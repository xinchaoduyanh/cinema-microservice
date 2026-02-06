
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Combo {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  isBestSeller?: boolean;
}

const COMBOS: Combo[] = [
  {
    id: 1,
    name: "Classic Duo",
    price: "120k",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=600",
    description: "Large Popcorn + 2 Large Soft Drinks",
  },
  {
    id: 2,
    name: "Modern Feast",
    price: "150k",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=600",
    description: "Extra Large Popcorn + XL Drink + Hot Nachos",
    isBestSeller: true,
  },
  {
    id: 3,
    name: "Petite Sweet",
    price: "95k",
    image: "https://images.unsplash.com/photo-1599307734170-66443e691937?auto=format&fit=crop&q=80&w=600",
    description: "Medium Popcorn + Drink + Macarons",
  },
  {
    id: 4,
    name: "The Collector",
    price: "220k",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=600",
    description: "Limited Edition Bucket + 2 XL Drinks + Snacks",
  },
];

export function Combos() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 max-w-[1600px] mx-auto">
      {COMBOS.map((combo) => (
        <motion.div
          key={combo.id}
          whileHover={{ y: -10 }}
          className="group relative flex flex-col h-full bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 hover:border-white/10"
        >
          {/* Best Seller Badge */}
          {combo.isBestSeller && (
            <div className="absolute top-6 left-6 z-20">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_white]">
                <Star className="w-3 h-3 fill-black" />
                Best Seller
              </span>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={combo.image}
              alt={combo.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-serif font-bold tracking-tight uppercase leading-none">
                {combo.name}
              </h3>
              <span className="font-mono text-xl text-white/90">{combo.price}</span>
            </div>
            
            <p className="text-sm text-white/40 font-light leading-relaxed mb-8 flex-1">
              {combo.description}
            </p>

            <button className="w-full py-4 glass border-white/5 rounded-2xl flex items-center justify-center gap-2 group/btn hover:bg-white hover:text-black transition-all">
              <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Add to Selection</span>
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
