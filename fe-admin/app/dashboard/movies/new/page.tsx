"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { movieService, CreateMoviePayload } from "@/services/movie.service"
import { MovieForm } from "@/components/dashboard/movies/MovieForm"

export default function NewMoviePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (payload: CreateMoviePayload) => {
    setLoading(true)
    try {
      await movieService.create(payload)
      router.push("/dashboard/movies")
    } catch (error) {
      console.error("Failed to create movie:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif uppercase">
              Add New <span className="text-primary italic">Movie</span>
            </h1>
            <p className="text-muted-foreground text-sm">Fill in the cinematic details below.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl px-6">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <MovieForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        title="Premiere"
      />
    </div>
  )
}
