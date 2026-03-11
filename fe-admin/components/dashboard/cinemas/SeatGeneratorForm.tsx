"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cinemaService, GenerateSeatsDto } from "@/services/cinema.service"
import { Loader2, AlertCircle } from "lucide-react"

interface SeatGeneratorFormProps {
  roomId: string
  onSuccess: () => void
}

export function SeatGeneratorForm({ roomId, onSuccess }: SeatGeneratorFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<GenerateSeatsDto>({
    numberOfRows: 10,
    seatsPerRow: 12,
    type: "STANDARD",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await cinemaService.generateSeats(roomId, formData)
      onSuccess()
    } catch (err: any) {
      console.error("Failed to generate seats:", err)
      setError(err.response?.data?.message || "Failed to generate layout. Make sure the room is empty.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider animate-shake">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="rows" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Number of Rows
          </Label>
          <Input
            id="rows"
            type="number"
            min={1}
            max={26}
            value={formData.numberOfRows}
            onChange={(e) => setFormData({ ...formData, numberOfRows: parseInt(e.target.value) })}
            required
            className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5"
          />
          <p className="text-[9px] text-muted-foreground ml-1 opacity-50 italic">Rows A to Z</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cols" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Seats Per Row
          </Label>
          <Input
            id="cols"
            type="number"
            min={1}
            value={formData.seatsPerRow}
            onChange={(e) => setFormData({ ...formData, seatsPerRow: parseInt(e.target.value) })}
            required
            className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5"
          />
        </div>

        <div className="space-y-2 col-span-full">
          <Label htmlFor="seatType" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
            Default Seat Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(val) => setFormData({ ...formData, type: val })}
          >
            <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-primary/50 transition-all px-5">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 rounded-2xl shadow-2xl">
              <SelectItem value="STANDARD" className="rounded-xl">Standard Seat</SelectItem>
              <SelectItem value="VIP" className="rounded-xl">VIP Seat</SelectItem>
              <SelectItem value="SWEETBOX" className="rounded-xl">Sweetbox (Couple)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-2">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Preview Summary</h4>
        <p className="text-sm font-medium text-muted-foreground">
          This will generate <span className="text-foreground font-bold">{formData.numberOfRows * formData.seatsPerRow}</span> seats arranged in <span className="text-foreground font-bold">{formData.numberOfRows}</span> rows.
          Existing seats must be removed before regenerating.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-14 rounded-2xl font-bold bg-primary text-black hover:scale-[1.02] active:scale-[0.98] transition-all cinematic-glow shadow-primary/20"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Confirm & Generate Layout"
        )}
      </Button>
    </form>
  )
}
