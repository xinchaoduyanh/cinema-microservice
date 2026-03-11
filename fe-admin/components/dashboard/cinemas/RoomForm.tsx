"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cinemaService, Room } from "@/services/cinema.service"
import { Loader2 } from "lucide-react"

interface RoomFormProps {
  cinemaId: string
  room?: Room
  onSuccess: () => void
}

export function RoomForm({ cinemaId, room, onSuccess }: RoomFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Room>>(
    room || {
      name: "",
      screenType: "2D",
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (room) {
        await cinemaService.updateRoom(room.id, formData)
      } else {
        await cinemaService.createRoom({ ...formData, cinemaId })
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save room:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Auditorium Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g. Cinema 01 / IMAX Room"
            className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenType" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Screen Format
          </Label>
          <Select
            value={formData.screenType}
            onValueChange={(val) => setFormData({ ...formData, screenType: val })}
          >
            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl shadow-2xl">
              <SelectItem value="2D" className="rounded-xl">Standard 2D</SelectItem>
              <SelectItem value="3D" className="rounded-xl">Digital 3D</SelectItem>
              <SelectItem value="IMAX" className="rounded-xl">IMAX Experience</SelectItem>
              <SelectItem value="4DX" className="rounded-xl">4DX Dynamic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-14 rounded-2xl font-bold bg-primary text-black hover:scale-[1.02] active:scale-[0.98] transition-all cinematic-glow shadow-primary/20"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : room ? (
          "Update Auditorium"
        ) : (
          "Create Auditorium"
        )}
      </Button>
    </form>
  )
}
