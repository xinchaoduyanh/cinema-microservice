"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreHorizontal, Film, Star, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { movieService, Movie } from "@/services/movie.service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const data = await movieService.getAll()
      setMovies(data)
    } catch (error) {
      console.error("Failed to fetch movies:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.originalTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NOW_SHOWING': return 'bg-foreground text-background border-foreground';
      case 'COMING_SOON': return 'bg-background text-foreground border-foreground/20';
      case 'END_OF_SHOW': return 'bg-muted text-muted-foreground border-border opacity-50';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  }

  const deleteMovie = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}"?`)) {
      try {
        await movieService.delete(id)
        setMovies(prev => prev.filter(m => m.id !== id))
      } catch (error) {
        console.error("Failed to delete movie:", error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header section with Stats & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-[0.5em] mb-2">
            <Film className="h-3 w-3" />
            Vault / Collection
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground font-serif uppercase leading-tight">
            Movies <span className="opacity-40 italic">Archive</span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm font-medium leading-relaxed opacity-70">
            Curating the finest selection of European and International cinema. Manage your digital vault with precision.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Filter by title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-80 bg-background/40 backdrop-blur-md border-border/50 rounded-full h-12 focus:w-96 transition-all duration-500 font-medium"
            />
          </div>
          <Link href="/dashboard/movies/new">
            <Button className="cinematic-glow font-bold rounded-full px-8 h-12 bg-primary text-black hover:scale-105 active:scale-95 transition-all duration-300">
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-2xl" />
              <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="group cursor-pointer">
                  {/* Poster Area - Elevating with Shadow & Border */}
                  <div className="relative aspect-[2/3] mb-6 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-700 group-hover:shadow-primary/20 group-hover:-translate-y-2">
                    {movie.posterUrl ? (
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        <Film className="h-16 w-16 text-muted-foreground/10" />
                      </div>
                    )}
                    
                    {/* Status Pin */}
                    <div className={cn(
                      "absolute top-5 left-5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border backdrop-blur-xl shadow-2xl",
                      getStatusColor(movie.status)
                    )}>
                      {movie.status.replace('_', ' ')}
                    </div>

                    {/* Quality Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                       <div className="flex gap-3 translate-y-8 group-hover:translate-y-0 transition-transform duration-700 delay-100">
                          <Link href={`/dashboard/movies/${movie.id}/edit`} className="flex-1">
                            <Button variant="secondary" size="sm" className="w-full rounded-xl font-bold bg-white text-black hover:bg-primary hover:text-black transition-colors">
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="rounded-xl bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMovie(movie.id, movie.title);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </div>
                  </div>

                  {/* Typography - European Minimalist */}
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-serif font-medium text-foreground transition-all duration-500 group-hover:text-primary leading-tight">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
                       <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(movie.releaseDate).getFullYear()}</span>
                       <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                       <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {movie.duration}m</span>
                       <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                       <span className="border border-muted-foreground/30 px-1.5 rounded">{movie.ageRating}</span>
                    </div>

                    <div className="pt-4 flex items-center justify-center gap-1">
                       {[1,2,3,4,5].map(star => (
                          <Star 
                            key={star} 
                            className={cn(
                              "h-3 w-3", 
                              star <= (movie.rating / 2) ? "text-primary fill-primary" : "text-muted/30"
                            )} 
                          />
                       ))}
                       <span className="text-[10px] font-bold ml-2 text-primary">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!loading && filteredMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 glass-card">
          <Film className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h3 className="text-xl font-bold text-muted-foreground">No movies found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  )
}
