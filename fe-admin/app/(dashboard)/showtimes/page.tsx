"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Calendar, Clock, Film, MapPin, Trash2, Edit2, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cinemaService, Showtime } from "@/services/cinema.service"
import { movieService, Movie } from "@/services/movie.service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Modal } from "@/components/dashboard/Modal"
import { ShowtimeForm } from "@/components/dashboard/cinemas/ShowtimeForm"

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal state
  const [stModal, setStModal] = useState<{ open: boolean; showtime?: Showtime }>({ open: false })

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

  const getMovie = (movieId: string) => {
    return movies.find(m => m.id === movieId)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Cancel this showtime? This will deactivate ticket sales for this session.")) {
      try {
        await cinemaService.removeShowtime(id)
        fetchData()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const filteredST = showtimes.filter(st => {
    const movie = getMovie(st.movieId)
    return movie?.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="space-y-12 pb-20">
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
            Schedule screenings and manage ticket inventory. Coordinate movie distribution across your theater network with real-time analytics.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setStModal({ open: true })}
            className="cinematic-glow font-bold rounded-full px-8 h-12 bg-primary text-black hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Showtime
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between pb-8 border-b border-white/5">
         <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-white/5 hover:bg-white/5"><ChevronLeft className="h-4 w-4" /></Button>
               <div className="text-center min-w-[140px]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-0.5">Operating Date</p>
                  <span className="text-sm font-black uppercase tracking-widest">{format(new Date(), "MMM dd, yyyy")}</span>
               </div>
               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-white/5 hover:bg-white/5"><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
               <Filter className="h-3.5 w-3.5" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Global Filters</span>
            </div>
         </div>
         <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search movies..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-80 bg-white/[0.03] border-white/10 h-12 rounded-full focus:w-96 transition-all duration-500 font-medium"
            />
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-white/[0.02] rounded-[2.5rem] animate-pulse border border-white/5 shadow-2xl" />)}
        </div>
      ) : filteredST.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredST.map((st, index) => {
             const movie = getMovie(st.movieId)
             return (
              <motion.div
                key={st.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="glass-card border-white/5 group hover:border-primary/20 transition-all duration-700 overflow-hidden rounded-[2.5rem] shadow-2xl">
                   <CardContent className="p-0">
                      <div className="flex flex-col">
                         <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                               <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 group-hover:rotate-[10deg]">
                                  <Film className="h-5 w-5" />
                               </div>
                               <div className="text-right">
                                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Session Price</p>
                                  <p className="text-2xl font-black tracking-tighter text-white">
                                    {new Intl.NumberFormat('en-US').format(st.price)}
                                    <span className="text-[10px] ml-1 opacity-40">{st.currency || 'VND'}</span>
                                  </p>
                               </div>
                            </div>
                            
                            <div className="space-y-2">
                               <h3 className="text-3xl font-serif font-black group-hover:text-primary transition-colors line-clamp-1 leading-tight uppercase">
                                 {movie?.title || "Unknown Feature"}
                               </h3>
                               <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest pt-1">
                                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary/60" /> {st.room?.name || 'Screen 1'}</span>
                                  <div className="h-1 w-1 bg-white/10 rounded-full" />
                                  <span className="flex items-center gap-1.5 text-primary"><Clock className="h-3 w-3" /> {format(new Date(st.startTime), "HH:mm")}</span>
                               </div>
                            </div>
                         </div>

                         <div className="bg-white/5 p-6 flex items-center justify-between border-t border-white/5 group-hover:bg-white/[0.08] transition-colors">
                            <div className="flex items-center gap-2">
                               <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-tight opacity-60">
                                 {format(new Date(st.startTime), "EEE, MMM dd")}
                               </span>
                            </div>
                            <div className="flex gap-2">
                               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all">
                                  <Edit2 className="h-4 w-4" />
                               </Button>
                               <Button 
                                onClick={() => handleDelete(st.id)}
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all"
                              >
                                  <Trash2 className="h-4 w-4" />
                               </Button>
                            </div>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              </motion.div>
             )
           })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-32 glass-card text-center rounded-[3rem] border border-dashed border-white/5">
           <Calendar className="h-24 w-24 text-muted-foreground/5 mb-8" />
           <h3 className="text-3xl font-serif font-black text-foreground mb-3 italic opacity-40 uppercase tracking-tighter">Quiet on the Set</h3>
           <p className="text-muted-foreground/50 text-sm font-medium max-w-sm mx-auto mb-10 leading-relaxed">
             The schedule is currently empty. Define showtimes to begin population and enable automated ticket sales.
           </p>
           <Button 
            onClick={() => setStModal({ open: true })}
            className="cinematic-glow font-bold rounded-full px-12 h-16 bg-white text-black hover:scale-105 active:scale-95 transition-all"
          >
             Create First Showtime
           </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={stModal.open}
        onClose={() => setStModal({ open: false })}
        title={stModal.showtime ? "Edit Session" : "Publish Showtime"}
      >
        <ShowtimeForm 
          showtime={stModal.showtime}
          onSuccess={() => { setStModal({ open: false }); fetchData(); }}
        />
      </Modal>
    </div>
  )
}

