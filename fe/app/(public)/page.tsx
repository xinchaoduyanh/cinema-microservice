
import React from "react";
import { Hero } from "@/components/hero/Hero";
import { MovieCard } from "@/components/movies/MovieCard";
import { CinemaMap } from "@/components/home/CinemaMap";
import { Combos } from "@/components/home/Combos";
import { DirectorsEdit } from "@/components/home/DirectorsEdit";
import { AtmosphericSound } from "@/components/home/AtmosphericSound";
import { movieService } from "@/services/movie.service";
import { cinemaService } from "@/services/cinema.service";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const [movies, cinemas] = await Promise.all([
    movieService.getAll(),
    cinemaService.getAll()
  ]);

  const nowPlaying = movies.filter((m) => m.status === "now-playing") as any[];
  const comingSoon = movies.filter((m) => m.status === "coming-soon") as any[];

  return (
    <div className="flex flex-col gap-32 pb-32">
      {/* Hero Section */}
      <Hero movies={nowPlaying} />

      {/* Now Playing Section */}
      <section className="px-6 md:px-12 max-w-[1600px] mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Curated Selection</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">Now Playing</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            View All Release <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {nowPlaying.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* NEW: Director's Edit (Magazine Style) */}
      <DirectorsEdit />

      {/* Combos Section */}
      <section className="w-full">
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto mb-12">
          <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Taste the Experience</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">Signature Combos</h2>
        </div>
        <Combos />
      </section>

      {/* NEW: Atmospheric Soundscape */}
      <AtmosphericSound />

      {/* Coming Soon Section */}
      <section className="px-6 md:px-12 max-w-[1600px] mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Upcoming</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">Coming Soon</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {comingSoon.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Cinema Locations Section */}
      <section className="px-6 md:px-12 max-w-[1600px] mx-auto w-full">
        <div className="mb-12">
          <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">Our Network</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">Cinema Locations</h2>
        </div>
        <CinemaMap cinemas={cinemas} />
      </section>
    </div>
  );
}
