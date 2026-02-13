"use client"

import { useEffect, useState } from "react"
import { Plus, Search, MapPin, Building2, Trash2, Edit2, Layout, Sofa, MoreHorizontal, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cinemaService, Cinema, Room } from "@/services/cinema.service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [roomsLoading, setRoomsLoading] = useState(false)

  useEffect(() => {
    fetchCinemas()
  }, [])

  const fetchCinemas = async () => {
    try {
      setLoading(true)
      const data = await cinemaService.getCinemas()
      setCinemas(data)
      if (data.length > 0) {
        handleSelectCinema(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch cinemas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCinema = async (cinema: Cinema) => {
    setSelectedCinema(cinema)
    setRoomsLoading(true)
    try {
      const data = await cinemaService.getRooms(cinema.id)
      setRooms(data)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
      setRooms([])
    } finally {
      setRoomsLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-[9px] font-bold uppercase tracking-[0.5em] mb-2">
            <Building2 className="h-3 w-3" />
            Infrastructure / Locations
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground font-serif uppercase leading-tight">
            Theaters <span className="opacity-40 italic">& Rooms</span>
          </h1>
          <p className="text-muted-foreground max-w-lg text-sm font-medium leading-relaxed opacity-70">
            Define your cinema network and theater layout. Manage screens and auditorium specifications.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button className="cinematic-glow font-bold rounded-full px-8 h-12 bg-primary text-black hover:scale-105 active:scale-95 transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            Add Cinema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cinema List - Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/50 px-2">Locations</h2>
          <div className="space-y-3">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-24 w-full bg-muted rounded-2xl animate-pulse" />)
            ) : (
              cinemas.map((cinema) => (
                <motion.div
                  key={cinema.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSelectCinema(cinema)}
                  className={cn(
                    "cursor-pointer p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden",
                    selectedCinema?.id === cinema.id 
                      ? "bg-foreground text-background border-foreground shadow-2xl" 
                      : "bg-background/40 hover:bg-background/60 border-white/5"
                  )}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif font-bold tracking-tight">{cinema.name}</h3>
                      <p className={cn(
                        "text-xs flex items-center gap-1 opacity-60",
                        selectedCinema?.id === cinema.id ? "text-background" : "text-muted-foreground"
                      )}>
                        <MapPin className="h-3 w-3" /> {cinema.address}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "h-5 w-5 transition-transform duration-500",
                      selectedCinema?.id === cinema.id ? "translate-x-0" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )} />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Room List - Right Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
              {selectedCinema ? `Auditoriums in ${selectedCinema.name}` : 'Auditoriums'}
            </h2>
            {selectedCinema && (
               <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest hover:text-primary">
                 <Plus className="h-3 w-3 mr-1" /> Add Room
               </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomsLoading ? (
               [1,2,3,4].map(i => <div key={i} className="h-48 w-full bg-muted rounded-3xl animate-pulse" />)
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <Card key={room.id} className="glass-card border-white/5 hover:border-primary/20 transition-all duration-500 group overflow-hidden">
                  <CardHeader className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-500">
                        <Layout className="h-6 w-6" />
                      </div>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary">
                           <Edit2 className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-500/20 hover:text-red-500">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-serif">{room.name}</CardTitle>
                    <CardDescription className="text-xs uppercase tracking-widest font-bold mt-2">
                      Standard Auditorium
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Seats</p>
                          <p className="text-xl font-black">--</p>
                       </div>
                       <div className="h-8 w-[1px] bg-white/5" />
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Type</p>
                          <p className="text-xl font-black">2D/3D</p>
                       </div>
                    </div>
                    <Button variant="outline" className="rounded-full border-white/10 hover:border-primary hover:text-primary font-bold px-6">
                      <Sofa className="h-4 w-4 mr-2" /> Map
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-20 glass-card text-center">
                 <Layout className="h-12 w-12 text-muted-foreground/20 mb-4" />
                 <p className="text-muted-foreground font-medium">No rooms found for this location.</p>
                 <Button variant="link" className="text-primary font-bold mt-2">Create your first room</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
