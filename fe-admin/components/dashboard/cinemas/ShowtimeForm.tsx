"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cinemaService, Showtime, Cinema, Room } from "@/services/cinema.service"
import { movieService, Movie } from "@/services/movie.service"
import { Loader2 } from "lucide-react"

interface ShowtimeFormProps {
  showtime?: Showtime
  onSuccess: () => void
}

export function ShowtimeForm({ showtime, onSuccess }: ShowtimeFormProps) {
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState<Movie[]>([])
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("")

  const [formData, setFormData] = useState<Partial<Showtime>>(
    showtime || {
      movieId: "",
      roomId: "",
      startTime: "",
      endTime: "",
      price: 0,
      currency: "VND",
    }
  )

  useEffect(() => {
    fetchDependantData()
  }, [])

  const fetchDependantData = async () => {
    try {
      const [mvData, cnData] = await Promise.all([
        movieService.getAll(),
        cinemaService.getCinemas()
      ])
      setMovies(mvData)
      setCinemas(cnData)

      // If editing, find initial cinema and load its rooms
      if (showtime?.roomId) {
        // This is a bit tricky since showtime might not have cinemaId directly
        // We'll trust the user to select cinema first if not available
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCinemaChange = async (cinemaId: string) => {
    setSelectedCinemaId(cinemaId)
    setRooms([])
    setFormData({ ...formData, roomId: "" })
    try {
      const roomData = await cinemaService.getRooms(cinemaId)
      setRooms(roomData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Basic logic for startTime conversion if needed
      await cinemaService.createShowtime(formData)
      onSuccess()
    } catch (error) {
      console.error("Failed to save showtime:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 col-span-full">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Movie Selection
          </Label>
          <Select
            value={formData.movieId}
            onValueChange={(val) => setFormData({ ...formData, movieId: val })}
          >
            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12">
              <SelectValue placeholder="Select a movie" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl max-h-[300px]">
              {movies.map(m => (
                <SelectItem key={m.id} value={m.id} className="rounded-xl">{m.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Theater Location
          </Label>
          <Select
            value={selectedCinemaId}
            onValueChange={handleCinemaChange}
          >
            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12">
              <SelectValue placeholder="Select cinema" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl">
              {cinemas.map(c => (
                <SelectItem key={c.id} value={c.id} className="rounded-xl">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Auditorium
          </Label>
          <Select
            value={formData.roomId}
            onValueChange={(val) => setFormData({ ...formData, roomId: val })}
            disabled={!selectedCinemaId}
          >
            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl">
              {rooms.map(r => (
                <SelectItem key={r.id} value={r.id} className="rounded-xl">{r.name} ({r.screenType})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Start Time
          </Label>
          <Input
            type="datetime-local"
            value={formData.startTime ? new Date(formData.startTime).toISOString().slice(0, 16) : ""}
            onChange={(e) => setFormData({ ...formData, startTime: new Date(e.target.value).toISOString() })}
            required
            className="bg-white/5 border-white/10 rounded-2xl h-12 px-5"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            End Time (Approx)
          </Label>
          <Input
            type="datetime-local"
            value={formData.endTime ? new Date(formData.endTime).toISOString().slice(0, 16) : ""}
            onChange={(e) => setFormData({ ...formData, endTime: new Date(e.target.value).toISOString() })}
            required
            className="bg-white/5 border-white/10 rounded-2xl h-12 px-5"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Base Ticket Price
          </Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
            className="bg-white/5 border-white/10 rounded-2xl h-12 px-5"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Currency
          </Label>
          <Select
            value={formData.currency}
            onValueChange={(val) => setFormData({ ...formData, currency: val })}
          >
            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12">
              <SelectValue placeholder="VND" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl">
              <SelectItem value="VND" className="rounded-xl">VND (Default)</SelectItem>
              <SelectItem value="USD" className="rounded-xl">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-14 rounded-2xl font-bold bg-primary text-black cinematic-glow shadow-primary/20 transition-all hover:scale-[1.01]"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : showtime ? "Update Showtime" : "Publish Showtime"}
      </Button>
    </form>
  )
}
