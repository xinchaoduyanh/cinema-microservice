
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Play, Volume2, VolumeX, RotateCcw, Ticket } from "lucide-react";
import { MOVIES, Movie } from "@/constants/movies";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Hero() {
  const nowPlayingMovies = MOVIES.filter(m => m.status === 'now-playing');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const activeMovie = nowPlayingMovies[activeIndex];

  // Logic: When movie changes, always stop the previous video preview
  useEffect(() => {
    setIsPlaying(false);
  }, [activeIndex]);

  // Auto-slide logic
  useEffect(() => {
    if (isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % nowPlayingMovies.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + nowPlayingMovies.length) % nowPlayingMovies.length);
  };

  const handlePlay = () => setIsPlaying(true);
  const handleStop = () => setIsPlaying(false);

  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-black">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0"
        onMouseEnter={() => setIsPlaying(true)}
        onMouseLeave={() => setIsPlaying(false)}
      >
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key={`img-${activeMovie.id}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <img
                src={activeMovie.backdropUrl}
                alt={activeMovie.title}
                className="w-full h-full object-cover grayscale-[10%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </motion.div>
          ) : (
            <motion.div
              key={`vid-${activeMovie.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-black"
            >
              {activeMovie.previewVideoUrl && !activeMovie.previewVideoUrl.includes('youtube') ? (
                <video
                  src={activeMovie.previewVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <iframe
                    src={`${activeMovie.previewVideoUrl?.includes('youtube') 
                      ? activeMovie.previewVideoUrl 
                      : activeMovie.trailerUrl}&start=0&end=10&autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${(activeMovie.previewVideoUrl || activeMovie.trailerUrl).split('/').pop()?.split('?')[0]}`}
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 object-cover scale-[1.1]"
                    allow="autoplay; encrypted-media"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrow (Right Only) */}
      <div className="absolute inset-y-0 right-0 z-20 flex items-center px-6 md:px-12 pointer-events-none">
        <button 
          onClick={handleNext}
          className="w-16 h-16 rounded-full border border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:scale-110 transition-all pointer-events-auto group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end px-6 md:px-12 pb-32 pointer-events-none">
        <motion.div
          key={`content-${activeMovie.id}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl pointer-events-auto"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold">
              Cinematic Spotlight
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#EAB308] font-bold text-sm">IMDb</span>
              <span className="text-white/80 font-mono text-sm">{activeMovie.rating}</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-[10rem] font-serif font-bold tracking-tighter mb-6 leading-[0.8] uppercase select-none">
            {activeMovie.title}
          </h1>

          <p className={cn(
            "text-lg md:text-xl text-white/60 max-w-2xl font-light leading-relaxed mb-8 transition-opacity duration-700",
            isPlaying ? "opacity-20" : "opacity-100"
          )}>
            {activeMovie.description}
          </p>

          <div className="flex items-center gap-6">
            <Link 
              href={`/movie/${activeMovie.id}`}
              className="px-10 py-5 bg-white text-black rounded-full font-bold flex items-center gap-3 hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <Ticket className="w-5 h-5 fill-black" />
              Đặt Vé Ngay
            </Link>
            
            <Link
              href={`/movie/${activeMovie.id}`}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group"
            >
              Xem Chi Tiết
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>


      {/* Global Controls Overlay (Bottom) */}
      <div className="absolute bottom-12 left-0 right-0 px-6 md:px-12 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          {nowPlayingMovies.map((movie, idx) => (
            <button
              key={movie.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "h-0.5 transition-all duration-700 rounded-full",
                activeIndex === idx ? "w-16 bg-white" : "w-8 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-6 pointer-events-auto">
          {isPlaying && (
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white hover:scale-110 transition-transform"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

    </section>
  );
}


