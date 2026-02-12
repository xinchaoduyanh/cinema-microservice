"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { movieService, CreateMoviePayload, Movie } from "@/services/movie.service"
import { MovieForm } from "@/components/dashboard/movies/MovieForm"

export default function EditMoviePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (id) {
       fetchMovie()
    }
  }, [id])

  const fetchMovie = async () => {
    try {
      setFetching(true)
      const data = await movieService.getOne(id)
      setMovie(data)
    } catch (error) {
      console.error("Failed to fetch movie:", error)
      router.push("/dashboard/movies")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (payload: CreateMoviePayload) => {
    setLoading(true)
    try {
      await movieService.update(id, payload)
      router.push("/dashboard/movies")
    } catch (error) {
      console.error("Failed to update movie:", error)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
     return <div className="flex items-center justify-center p-20">Loading...</div>
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
              Edit <span className="text-primary italic">Movie</span>
            </h1>
            <p className="text-muted-foreground text-sm">Update the cinematic details for {movie?.title}.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()} className="rounded-xl px-6">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {movie && (
        <MovieForm 
          initialData={movie}
          onSubmit={handleSubmit} 
          loading={loading} 
          title="Save Changes"
        />
      )}
    </div>
  )
}
