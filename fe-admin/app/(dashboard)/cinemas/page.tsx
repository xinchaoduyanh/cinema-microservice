"use client"

import { useEffect, useState } from "react"
import { Plus, MapPin, Building2, Trash2, Edit2, Layout, Sofa, ChevronRight, Loader2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cinemaService, Cinema, Room } from "@/services/cinema.service"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Modal } from "@/components/dashboard/Modal"
import { CinemaForm } from "@/components/dashboard/cinemas/CinemaForm"
import { RoomForm } from "@/components/dashboard/cinemas/RoomForm"
import { SeatGeneratorForm } from "@/components/dashboard/cinemas/SeatGeneratorForm"

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [roomsLoading, setRoomsLoading] = useState(false)

  // Modal states
  const [cinemaModal, setCinemaModal] = useState<{ open: boolean; cinema?: Cinema }>({ open: false })
  const [roomModal, setRoomModal] = useState<{ open: boolean; cinemaId?: string; room?: Room }>({ open: false })
  const [seatGenModal, setSeatGenModal] = useState<{ open: boolean; roomId?: string }>({ open: false })

  useEffect(() => {
    fetchCinemas()
  }, [])

  const fetchCinemas = async () => {
    try {
      setLoading(true)
      const data = await cinemaService.getCinemas()
      setCinemas(data)
      if (data.length > 0 && !selectedCinema) {
        handleSelectCinema(data[0])
      } else if (selectedCinema) {
        // Refresh rooms of selected cinema
        const updated = data.find(c => c.id === selectedCinema.id)
        if (updated) handleSelectCinema(updated)
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

  const handleDeleteCinema = async (cinema: Cinema) => {
    if (confirm(`Are you sure you want to delete ${cinema.name}? All rooms and data will be lost.`)) {
      try {
        await cinemaService.removeCinema(cinema.id)
        fetchCinemas()
        if (selectedCinema?.id === cinema.id) setSelectedCinema(null)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleDeleteRoom = async (room: Room) => {
    if (confirm(`Delete ${room.name}? This action cannot be undone.`)) {
      try {
        await cinemaService.removeRoom(room.id)
        if (selectedCinema) handleSelectCinema(selectedCinema)
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className="space-y-12 pb-20">
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
            Define your cinema network and theater layout. Manage screens and auditorium specifications across your digital estate.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setCinemaModal({ open: true })}
            className="cinematic-glow font-bold rounded-full px-8 h-12 bg-primary text-black hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Cinema
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cinema List - Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 px-2 flex items-center justify-between">
            Active Locations
            <span className="bg-white/5 px-2 py-0.5 rounded-full text-[8px]">{cinemas.length}</span>
          </h2>
          <div className="space-y-3">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-white/5 rounded-3xl animate-pulse border border-white/5" />)
            ) : (
              cinemas.map((cinema) => (
                <motion.div
                  key={cinema.id}
                  whileHover={{ x: 6 }}
                  onClick={() => handleSelectCinema(cinema)}
                  className={cn(
                    "cursor-pointer p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden",
                    selectedCinema?.id === cinema.id 
                      ? "bg-white text-black border-white shadow-[0_20px_50px_rgba(255,255,255,0.1)]" 
                      : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5"
                  )}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif font-black tracking-tight uppercase leading-none">{cinema.name}</h3>
                      <p className={cn(
                        "text-[10px] font-bold flex items-center gap-1 opacity-60 uppercase tracking-widest pt-2",
                        selectedCinema?.id === cinema.id ? "text-black" : "text-muted-foreground"
                      )}>
                        <MapPin className="h-3 w-3" /> {cinema.city || 'Unknown'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <ChevronRight className={cn(
                        "h-5 w-5 transition-transform duration-500",
                        selectedCinema?.id === cinema.id ? "translate-x-0" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                      )} />
                      {selectedCinema?.id === cinema.id && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-black hover:bg-black/5" onClick={(e) => { e.stopPropagation(); setCinemaModal({ open: true, cinema }) }}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDeleteCinema(cinema) }}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Room List - Right Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
              {selectedCinema ? `Auditoriums in ${selectedCinema.name}` : 'Auditoriums'}
            </h2>
            {selectedCinema && (
               <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setRoomModal({ open: true, cinemaId: selectedCinema.id })}
                className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all"
              >
                 <Plus className="h-3 w-3 mr-1" /> Add Room
               </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomsLoading ? (
               [1, 2, 3, 4].map(i => <div key={i} className="h-56 w-full bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />)
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <Card key={room.id} className="glass-card border-white/5 hover:border-primary/20 transition-all duration-700 group overflow-hidden rounded-[2.5rem]">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 group-hover:rotate-12">
                        <Layout className="h-6 w-6" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white/10" onClick={() => setRoomModal({ open: true, cinemaId: selectedCinema?.id, room })}>
                           <Edit2 className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-red-500/20 hover:text-red-500" onClick={() => handleDeleteRoom(room)}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-serif font-black uppercase tracking-tight">{room.name}</CardTitle>
                      <CardDescription className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mt-1">
                        Format / {room.screenType || '2D'}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Status</p>
                            <div className="flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                              <span className="text-xs font-bold uppercase tracking-wider">Active</span>
                            </div>
                         </div>
                         <div className="h-8 w-[1px] bg-white/5" />
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Layout</p>
                            <p className="text-sm font-black">Verified</p>
                         </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setSeatGenModal({ open: true, roomId: room.id })}
                        className="rounded-full border-white/5 bg-white/5 hover:bg-primary hover:text-black hover:border-primary font-bold px-6 h-11 transition-all group-hover:scale-105 active:scale-95"
                      >
                        <Sofa className="h-4 w-4 mr-2" />
                        Seat Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : selectedCinema ? (
              <div className="col-span-full flex flex-col items-center justify-center p-24 glass-card text-center border-dashed border-white/5 rounded-[3rem]">
                 <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Layout className="h-8 w-8 text-muted-foreground/20" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold text-foreground mb-2 italic opacity-60">No screens found</h3>
                 <p className="text-muted-foreground/70 text-xs font-medium max-w-[200px] leading-relaxed mb-6">
                   This location doesn't have any auditorium defined yet.
                 </p>
                 <Button 
                  onClick={() => setRoomModal({ open: true, cinemaId: selectedCinema.id })}
                  className="rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest px-8"
                >
                  Create Screen
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal 
        isOpen={cinemaModal.open} 
        onClose={() => setCinemaModal({ open: false })} 
        title={cinemaModal.cinema ? "Edit Cinema" : "New Location"}
      >
        <CinemaForm 
          cinema={cinemaModal.cinema} 
          onSuccess={() => { setCinemaModal({ open: false }); fetchCinemas(); }} 
        />
      </Modal>

      <Modal 
        isOpen={roomModal.open} 
        onClose={() => setRoomModal({ open: false })} 
        title={roomModal.room ? "Edit Auditorium" : "New Screen"}
      >
        {roomModal.cinemaId && (
          <RoomForm 
            cinemaId={roomModal.cinemaId}
            room={roomModal.room} 
            onSuccess={() => { setRoomModal({ open: false }); selectedCinema && handleSelectCinema(selectedCinema); }} 
          />
        )}
      </Modal>

      <Modal 
        isOpen={seatGenModal.open} 
        onClose={() => setSeatGenModal({ open: false })} 
        title="Layout Generator"
      >
        {seatGenModal.roomId && (
          <SeatGeneratorForm 
            roomId={seatGenModal.roomId} 
            onSuccess={() => { setSeatGenModal({ open: false }); alert("Layout generated successfully!") }} 
          />
        )}
      </Modal>
    </div>
  )
}

