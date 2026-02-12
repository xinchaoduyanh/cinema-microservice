"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Plus, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateMoviePayload, Movie } from "@/services/movie.service"
import { genreService, Genre } from "@/services/genre.service"
import { cn } from "@/lib/utils"

interface MovieFormProps {
  initialData?: Movie;
  onSubmit: (data: CreateMoviePayload) => Promise<void>;
  loading: boolean;
  title: string;
}

export function MovieForm({ initialData, onSubmit, loading, title }: MovieFormProps) {
  const router = useRouter()
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [cast, setCast] = useState<{ name: string, role: string }[]>([{ name: "", role: "" }])

  const [formData, setFormData] = useState<Partial<CreateMoviePayload>>({
    title: "",
    originalTitle: "",
    description: "",
    longDescription: "",
    releaseDate: "",
    duration: 120,
    ageRating: "G",
    status: "COMING_SOON",
    trailerUrl: "",
    backdropUrl: "",
    posterUrl: "",
    previewVideoUrl: ""
  })

  useEffect(() => {
    fetchGenres()
    if (initialData) {
      setFormData({
        title: initialData.title,
        originalTitle: initialData.originalTitle,
        description: initialData.description,
        longDescription: initialData.longDescription,
        releaseDate: initialData.releaseDate.split('T')[0],
        duration: initialData.duration,
        ageRating: initialData.ageRating,
        status: initialData.status,
        trailerUrl: initialData.trailerUrl,
        backdropUrl: initialData.backdropUrl,
        posterUrl: initialData.posterUrl,
        previewVideoUrl: initialData.previewVideoUrl
      })
      if (initialData.movieGenres) {
        setSelectedGenres(initialData.movieGenres.map(mg => mg.genre.id))
      }
      if (initialData.cast) {
        setCast(initialData.cast.map(c => ({ name: c.person.name, role: c.roleName })))
      }
    }
  }, [initialData])

  const fetchGenres = async () => {
    try {
      const data = await genreService.getAll()
      setGenres(data)
    } catch (error) {
      console.error("Failed to fetch genres:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCastChange = (index: number, field: "name" | "role", value: string) => {
    const newCast = [...cast]
    newCast[index][field] = value
    setCast(newCast)
  }

  const addCastMember = () => setCast([...cast, { name: "", role: "" }])
  const removeCastMember = (index: number) => setCast(cast.filter((_, i) => i !== index))

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CreateMoviePayload = {
      ...formData as CreateMoviePayload,
      genreIds: selectedGenres,
      cast: cast.filter(c => c.name && c.role)
    }
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Basic Narrative</CardTitle>
            <CardDescription>Primary identifiers and story summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest opacity-70">Main Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g. Inception" 
                  required 
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalTitle" className="text-xs font-bold uppercase tracking-widest opacity-70">Original Title</Label>
                <Input 
                  id="originalTitle" 
                  name="originalTitle" 
                  placeholder="If different..." 
                  value={formData.originalTitle}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest opacity-70">Short Synopsis</Label>
              <Textarea 
                id="description" 
                name="description" 
                placeholder="Catchy tagline or brief summary..." 
                className="h-20"
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription" className="text-xs font-bold uppercase tracking-widest opacity-70">Full Plot Details</Label>
              <Textarea 
                id="longDescription" 
                name="longDescription" 
                placeholder="Detailed narrative for the production page..." 
                className="h-40"
                value={formData.longDescription}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Production Gallery</CardTitle>
            <CardDescription>Visual assets and trailers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="posterUrl" className="text-xs font-bold uppercase tracking-widest opacity-70">Poster URL</Label>
                <Input 
                  id="posterUrl" 
                  name="posterUrl" 
                  placeholder="https://..." 
                  value={formData.posterUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backdropUrl" className="text-xs font-bold uppercase tracking-widest opacity-70">Backdrop URL</Label>
                <Input 
                  id="backdropUrl" 
                  name="backdropUrl" 
                  placeholder="https://..." 
                  value={formData.backdropUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="trailerUrl" className="text-xs font-bold uppercase tracking-widest opacity-70">Trailer URL (YouTube/Vimeo)</Label>
                <Input 
                  id="trailerUrl" 
                  name="trailerUrl" 
                  placeholder="https://..." 
                  value={formData.trailerUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previewVideoUrl" className="text-xs font-bold uppercase tracking-widest opacity-70">Preview Loop Clip</Label>
                <Input 
                  id="previewVideoUrl" 
                  name="previewVideoUrl" 
                  placeholder="Direct .mp4 link..." 
                  value={formData.previewVideoUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif">The Ensemble</CardTitle>
              <CardDescription>Cast members and their roles</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addCastMember} className="rounded-lg">
              <Plus className="h-4 w-4 mr-2" /> Add Talent
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {cast.map((item, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] uppercase opacity-50 px-1">Actor Name</Label>
                  <Input 
                    placeholder="e.g. Leonardo DiCaprio" 
                    value={item.name}
                    onChange={(e) => handleCastChange(index, "name", e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] uppercase opacity-50 px-1">Role / Character</Label>
                  <Input 
                    placeholder="e.g. Cobb" 
                    value={item.role}
                    onChange={(e) => handleCastChange(index, "role", e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeCastMember(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  disabled={cast.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Controls */}
      <div className="space-y-8">
        <Card className="glass-card border-border sticky top-8">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Release Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-70">Showtime Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                  <SelectItem value="NOW_SHOWING">Now Showing</SelectItem>
                  <SelectItem value="END_OF_SHOW">Ended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest opacity-70">Release Date</Label>
                <Input 
                  type="date" 
                  name="releaseDate" 
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest opacity-70">Runtime (min)</Label>
                <Input 
                  type="number" 
                  name="duration" 
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-70">Age Rating</Label>
              <Select 
                value={formData.ageRating} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, ageRating: val }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="G">G (All Ages)</SelectItem>
                  <SelectItem value="PG">PG (Parental Guidance)</SelectItem>
                  <SelectItem value="PG-13">PG-13 (13+)</SelectItem>
                  <SelectItem value="R">R (17+ Restricted)</SelectItem>
                  <SelectItem value="NC-17">NC-17 (Adults Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest opacity-70">Genres</Label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleGenreToggle(genre.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300",
                      selectedGenres.includes(genre.id)
                        ? "bg-primary text-black border-primary cinematic-glow"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                    )}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <div className="flex items-center gap-2 text-primary p-3 bg-primary/10 rounded-xl border border-primary/20">
                <AlertCircle className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Metadata review required</span>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full cinematic-glow rounded-xl font-bold mt-4"
            >
              {loading ? "Recording..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
