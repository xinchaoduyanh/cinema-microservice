"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cinemaService, Cinema } from "@/services/cinema.service"
import { Loader2 } from "lucide-react"

interface CinemaFormProps {
  cinema?: Cinema
  onSuccess: () => void
}

export function CinemaForm({ cinema, onSuccess }: CinemaFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Cinema>>(
    cinema || {
      name: "",
      address: "",
      city: "",
      description: "",
      imageUrl: "",
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (cinema) {
        await cinemaService.updateCinema(cinema.id, formData)
      } else {
        await cinemaService.createCinema(formData)
      }
      onSuccess()
    } catch (error) {
      console.error("Failed to save cinema:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 col-span-full">
          <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Cinema Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g. CGV Vincom Ba Trieu"
            className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            City
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Ha Noi"
            className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Image URL
          </Label>
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5"
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Address
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            placeholder="No 191 Ba Trieu, Hai Ba Trung District"
            className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5"
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter a brief introduction..."
            className="bg-white/5 border-white/10 rounded-3xl min-h-[120px] focus:border-primary/50 transition-all p-5"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-14 rounded-2xl font-bold bg-primary text-black hover:scale-[1.02] active:scale-[0.98] transition-all cinematic-glow shadow-primary/20"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : cinema ? (
          "Save Changes"
        ) : (
          "Add Cinema"
        )}
      </Button>
    </form>
  )
}

