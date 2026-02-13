"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Calendar, Clock, Film, MapPin, Trash2, Edit2, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cinemaService, Showtime } from "@/services/cinema.service"
import { movieService, Movie } from "@/services/movie.service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [stData, mvData] = await Promise.all([
        cinemaService.getShowtimes(),
        movieService.getAll()
      ])
      setShowtimes(stData)
      setMovies(mvData)
    } catch (error) {
      console.error("Failed to fetch showtimes data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMovieTitle = (movieId: string) => {
    return movies.find(m => m.id === movieId)?.title || "Unknown Movie"
  }

  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-[0.5em] mb-2">
            <Calendar className="h-3 w-3" />
            Scheduling / Ticketing
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground font-serif uppercase leading-tight">
            Showtime <span className="opacity-40 italic">Manager</span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm font-medium leading-relaxed opacity-70">
            Schedule screenings and manage ticket inventory. Coordinate movie distribution across your theater network.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="cinematic-glow font-bold rounded-full px-8 h-12 bg-primary text-black hover:scale-105 active:scale-95 transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            New Showtime
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-white/5"><ChevronLeft className="h-4 w-4" /></Button>
               <span className="text-sm font-black uppercase tracking-widest">Today, {format(new Date(), "MMMM dd")}</span>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-white/5"><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-2">
               <Filter className="h-3.5 w-3.5 text-muted-foreground" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Filter by Cinema</span>
            </div>
         </div>
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input 
              placeholder="Search by movie..." 
              className="pl-9 w-64 bg-background/20 border-white/5 h-10 rounded-full text-xs"
            />
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-muted rounded-3xl animate-pulse" />)}
        </div>
      ) : showtimes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {showtimes.map((st, index) => (
             <motion.div
               key={st.id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, delay: index * 0.05 }}
             >
               <Card className="glass-card border-white/5 group hover:border-primary/20 transition-all duration-500 overflow-hidden">
                  <CardContent className="p-0">
                     <div className="flex flex-col">
                        <div className="p-6 space-y-4">
                           <div className="flex justify-between items-start">
                              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                 <Film className="h-5 w-5" />
                              </div>
                              <div className="text-right">
                                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Price</p>
                                 <p className="text-lg font-black">{new Intl.NumberFormat('vi-VN').format(st.price)} {st.currency}</p>
                              </div>
                           </div>
                           
                           <div className="space-y-1">
                              <h3 className="text-xl font-serif font-bold group-hover:text-primary transition-colors line-clamp-1">
                                {getMovieTitle(st.movieId)}
                              </h3>
                              <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                 <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Screen {st.room?.name || '#1'}</span>
                                 <span className="w-1 h-1 bg-white/10 rounded-full" />
                                 <span className="flex items-center gap-1 text-primary"><Clock className="h-3 w-3" /> {format(new Date(st.startTime), "HH:mm")}</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-white/5 p-4 flex items-center justify-between border-t border-white/5">
                           <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">{format(new Date(st.startTime), "EEE, d MMM yyyy")}</span>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary">
                                 <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-red-500">
                                 <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-32 glass-card text-center">
           <Calendar className="h-20 w-20 text-muted-foreground/10 mb-6" />
           <h3 className="text-2xl font-serif font-medium text-muted-foreground mb-2">No showtimes scheduled</h3>
           <p className="text-muted-foreground/60 max-w-md mx-auto mb-8">
             Your cinema schedule is looking a bit empty. Start planning your movie sessions to begin selling tickets.
           </p>
           <Button className="cinematic-glow font-bold rounded-full px-12 h-14 bg-primary text-black">
             Create First Showtime
           </Button>
        </div>
      )}
    </div>
  )
}
