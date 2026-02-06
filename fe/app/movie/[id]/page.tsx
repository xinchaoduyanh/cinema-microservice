
"use client";

import React, { use, useState, useRef } from "react";
import { MOVIES } from "@/constants/movies";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Clock, Calendar, Star, ShieldCheck, ArrowLeft, 
  Users, Ticket, ChevronRight, ChevronLeft, X, Camera, BookOpen
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const movie = MOVIES.find((m) => m.id === id);
  const [selectedStill, setSelectedStill] = useState<string | null>(null);
  const castScrollRef = useRef<HTMLDivElement>(null);

  if (!movie) {
    notFound();
  }

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 200]);
  const opacityHeader = useTransform(scrollY, [0, 300], [1, 0]);

  const similarMovies = MOVIES.filter(m => m.id !== movie.id && m.status === movie.status).slice(0, 4);

  const scrollCast = (direction: 'left' | 'right') => {
    if (castScrollRef.current) {
      const scrollAmount = 400;
      castScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-black selection:bg-white selection:text-black">
      {/* Cinematic Background Glow */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.15] blur-[150px] z-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% -20%, ${movie.accentColor} 0%, transparent 80%)`
        }}
      />

      {/* 1. Hero Content Area */}
      <header className="relative h-screen w-full overflow-hidden flex items-end pb-24">
        <motion.div 
          style={{ y: yParallax, opacity: opacityHeader }} 
          className="absolute inset-0 z-0"
        >
          <img
            src={movie.backdropUrl}
            className="w-full h-full object-cover grayscale-[30%] scale-105"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full px-6 md:px-12">
          <div className="max-w-[1600px] mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-all uppercase tracking-[0.4em] text-[10px] font-bold mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
              Back to Collection
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 glass border-white/10 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold text-white/60">
                  {movie.status === 'now-playing' ? 'Cinematic Release' : 'Coming Soon'}
                </span>
                <span className="text-[#EAB308] font-bold text-sm tracking-tighter flex items-center gap-1">
                  IMDb {movie.rating}
                </span>
              </div>

              <h1 className="text-6xl md:text-[8rem] font-serif font-bold tracking-tighter mb-8 leading-[0.8] uppercase">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-bold text-white/40">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {movie.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> {movie.releaseDate}
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  {movie.genre.join(" • ")}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* 2. Main Narrative & Detail Section */}
      <main className="relative z-10 px-6 md:px-12 py-32 space-y-32">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Synopsis */}
          <div className="lg:col-span-8 space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <BookOpen className="w-5 h-5 text-white/30" />
                <span className="text-white font-black uppercase tracking-[0.4em] text-xs block">THE NARRATIVE</span>
              </div>
              <p className="text-2xl md:text-3xl text-white/90 font-serif italic leading-relaxed">
                "{movie.description}"
              </p>
              <p className="text-lg text-white/50 font-light leading-relaxed max-w-4xl">
                {movie.longDescription}
              </p>
            </section>
          </div>

          {/* Technicals Sidebar */}
          <div className="lg:col-span-4 lg:pt-16">
            <div className="glass rounded-[2rem] p-10 space-y-8 border-white/5">
              <div className="space-y-6">
                <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Technical Specifications</div>
                <div className="flex flex-wrap gap-3">
                  {['IMAX', 'DOLBY ATMOS', '4K HDR', 'THX'].map((t) => (
                    <span key={t} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {movie.rottenTomatoes !== undefined && (
                <div className="pt-8 border-t border-white/5 flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-white/40" />
                    <span className="text-xs uppercase tracking-widest font-bold text-white/60">Critic Score</span>
                  </div>
                  <span className="text-xl font-serif">{movie.rottenTomatoes}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Cast & Creative Section (With Slider) */}
        <section className="max-w-[1600px] mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-white/30" />
              <h2 className="text-white font-black uppercase tracking-[0.4em] text-xs">CAST & CREATIVE</h2>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => scrollCast('left')}
                className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scrollCast('right')}
                className="w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div 
            ref={castScrollRef}
            className="flex gap-8 overflow-x-auto hide-scrollbar scroll-smooth pb-8"
          >
            {/* Director */}
            <div className="flex-none w-64 group space-y-4">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden glass border-white/10 group-hover:border-white/30 transition-all duration-700">
                <img src={movie.director.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={movie.director.name} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold uppercase tracking-tight">{movie.director.name}</h4>
                <p className="text-[10px] uppercase tracking-widest text-[#EAB308] font-bold">Director</p>
              </div>
            </div>

            {/* Actors */}
            {movie.cast.map((actor) => (
              <div key={actor.name} className="flex-none w-64 group space-y-4">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden glass border-white/10 group-hover:border-white/30 transition-all duration-700">
                  <img src={actor.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={actor.name} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold uppercase tracking-tight">{actor.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">{actor.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Cinematic Frames / Gallery */}
        <section className="max-w-[1600px] mx-auto space-y-12">
          <div className="flex items-center gap-4">
            <Camera className="w-6 h-6 text-white/30" />
            <h2 className="text-white font-black uppercase tracking-[0.4em] text-xs">CINEMATIC FRAMES</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {movie.stills.map((still, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 0.98 }}
                onClick={() => setSelectedStill(still)}
                className="aspect-video bg-white/5 cursor-zoom-in rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/5"
              >
                <img src={still} className="w-full h-full object-cover" alt={`Still ${idx}`} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 5. More Like This Section */}
        <section className="max-w-[1600px] mx-auto pt-32 border-t border-white/5">
          <div className="mb-16">
            <span className="text-white font-black uppercase tracking-[0.4em] text-xs block mb-4">YOU MIGHT ALSO LIKE</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase leading-none">Similar Visions</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {similarMovies.map((m) => (
              <Link key={m.id} href={`/movie/${m.id}`} className="group space-y-6">
                <div className="aspect-[2/3] rounded-3xl overflow-hidden glass border-white/5 group-hover:border-white/20 transition-all shadow-2xl">
                  <img src={m.posterUrl} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" alt="" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold uppercase tracking-tight group-hover:text-white transition-colors">{m.title}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">{m.genre[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Global Elements */}
      <AnimatePresence>
        {selectedStill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedStill(null)}
          >
            <button className="absolute top-8 right-8 p-4 hover:bg-white/10 rounded-full transition-all">
              <X className="w-8 h-8" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedStill} 
              className="max-w-full max-h-[90vh] rounded-[2rem] object-contain shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-12 left-6 right-6 md:left-auto md:right-12 md:max-w-xs w-auto z-50"
      >
        <button 
          className="w-full h-20 rounded-full font-bold text-xs tracking-[0.3em] uppercase shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:scale-105 active:scale-95 text-black flex items-center justify-center gap-4 group"
          style={{ backgroundColor: movie.accentColor }}
        >
          <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Book Experience
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
