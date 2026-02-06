
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Movie } from "@/constants/movies";
import Link from "next/link";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <motion.div
        whileHover={{ y: -10 }}
        className="group relative aspect-[2/3] w-full cursor-pointer rounded-2xl overflow-hidden bg-[#111]"
      >
        {/* Glowing Border Effect on Hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 40px ${movie.accentColor}33, 0 0 20px ${movie.accentColor}44`,
            border: `1px solid ${movie.accentColor}66`
          }}
        />

        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-3 h-3 fill-[#EAB308] text-[#EAB308]" />
            <span className="text-xs font-mono text-white/80">{movie.rating}</span>
          </div>
          <h3 className="text-xl font-serif font-bold tracking-tight text-white leading-tight mb-2">
            {movie.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {movie.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] uppercase tracking-widest text-white/40">
                {g}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>

  );
}
