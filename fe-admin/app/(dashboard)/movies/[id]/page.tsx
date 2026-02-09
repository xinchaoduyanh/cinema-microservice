"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Trash2, Plus } from "lucide-react"
import { movieService, CreateMoviePayload, Movie } from "@/services/movie.service"
import { genreService, Genre } from "@/services/genre.service"

interface EditMoviePageProps {
  params: Promise<{ id: string }>
}

export default function EditMoviePage({ params }: EditMoviePageProps) {
  const router = useRouter()
  // Unwrap params using React.use()
  const { id } = use(params)
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [genres, setGenres] = useState<Genre[]>([])
  
  const [formData, setFormData] = useState<CreateMoviePayload>({
    title: "",
    originalTitle: "",
    description: "",
    longDescription: "",
    releaseDate: "",
    duration: 120,
    ageRating: "C13",
    status: "COMING_SOON",
    trailerUrl: "",
    posterUrl: "",
    backdropUrl: "",
    previewVideoUrl: "",
    genreIds: [],
    directorNames: [],
    cast: [] 
  })

  const [directorInput, setDirectorInput] = useState("")
  const [castInput, setCastInput] = useState<{name: string, role: string}[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [genresData, movieData] = await Promise.all([
          genreService.getAll(),
          movieService.getOne(id)
        ])
        setGenres(genresData)
        
        // Populate Form
        setFormData({
          title: movieData.title,
          originalTitle: movieData.originalTitle || "",
          description: movieData.description,
          longDescription: (movieData as any).longDescription || "", // cast if needed
          releaseDate: movieData.releaseDate ? new Date(movieData.releaseDate).toISOString().split('T')[0] : "",
          duration: movieData.duration,
          ageRating: movieData.ageRating,
          status: movieData.status,
          trailerUrl: (movieData.trailerUrl) || "",
          posterUrl: (movieData.posterUrl) || "",
          backdropUrl: (movieData.backdropUrl) || "",
          previewVideoUrl: (movieData.previewVideoUrl as any) || "",
          genreIds: movieData.movieGenres?.map((mg: any) => mg.genre.id) || [],
          directorNames: [], // Filled below
          cast: [] // Filled below
        })

        // Populate Helper State
        const directors = movieData.directors?.map((d: any) => d.director.name).join(", ") || ""
        setDirectorInput(directors)

        const castList = movieData.cast?.map((c: any) => ({
          name: c.person.name,
          role: c.roleName
        })) || []
        setCastInput(castList.length ? castList : [{name: "", role: ""}])

      } catch (error) {
        console.error("Failed to load movie data", error)
        alert("Failed to load movie data")
        router.push('/movies')
      } finally {
        setFetching(false)
      }
    }
    loadData()
  }, [id, router])

  const handleGenreToggle = (id: string) => {
    setFormData(prev => {
      const current = prev.genreIds || []
      if (current.includes(id)) {
        return { ...prev, genreIds: current.filter(g => g !== id) }
      }
      return { ...prev, genreIds: [...current, id] }
    })
  }

  const handleCastChange = (index: number, field: 'name' | 'role', value: string) => {
    const newCast = [...castInput]
    newCast[index][field] = value
    setCastInput(newCast)
  }

  const addCastRow = () => {
    setCastInput([...castInput, { name: "", role: "" }])
  }

  const removeCastRow = (index: number) => {
    setCastInput(castInput.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const directors = directorInput.split(',').map(d => d.trim()).filter(Boolean)
      const finalCast = castInput.filter(c => c.name && c.role)

      await movieService.update(id, {
        ...formData,
        directorNames: directors,
        cast: finalCast
      })
      
      router.push('/movies')
    } catch (error) {
      console.error("Failed to update movie", error)
      alert("Failed to update movie")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="flex items-center justify-center min-h-[50vh] text-white">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-white">Edit Movie</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Reuse the exact same form structure from CreatePage */}
        {/* Basic Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required 
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalTitle" className="text-gray-300">Original Title</Label>
                <Input 
                  id="originalTitle"
                  value={formData.originalTitle} 
                  onChange={e => setFormData({...formData, originalTitle: e.target.value})}
                  className="bg-gray-950 border-gray-800"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Short Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
                className="bg-gray-950 border-gray-800 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription" className="text-gray-300">Long Description</Label>
              <Textarea 
                id="longDescription"
                value={formData.longDescription} 
                onChange={e => setFormData({...formData, longDescription: e.target.value})}
                className="bg-gray-950 border-gray-800 min-h-[150px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Media & Details */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">Media & Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Release Date <span className="text-red-500">*</span></Label>
                <Input 
                  type="date"
                  value={formData.releaseDate} 
                  onChange={e => setFormData({...formData, releaseDate: e.target.value})}
                  required 
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Duration (mins) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  min="1"
                  value={formData.duration} 
                  onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                  required 
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Age Rating <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.ageRating} 
                  onValueChange={val => setFormData({...formData, ageRating: val})}
                >
                  <SelectTrigger className="bg-gray-950 border-gray-800">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
                    <SelectItem value="P">P (General)</SelectItem>
                    <SelectItem value="C13">C13 (13+)</SelectItem>
                    <SelectItem value="C16">C16 (16+)</SelectItem>
                    <SelectItem value="C18">C18 (18+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
               <Label className="text-gray-300">Status <span className="text-red-500">*</span></Label>
               <Select 
                  value={formData.status} 
                  onValueChange={val => setFormData({...formData, status: val})}
                >
                  <SelectTrigger className="bg-gray-950 border-gray-800">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
                    <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                    <SelectItem value="NOW_SHOWING">Now Showing</SelectItem>
                    <SelectItem value="ENDED">Ended</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Poster URL</Label>
                <Input 
                  placeholder="https://..."
                  value={formData.posterUrl} 
                  onChange={e => setFormData({...formData, posterUrl: e.target.value})}
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Backdrop URL</Label>
                <Input 
                  placeholder="https://..."
                  value={formData.backdropUrl} 
                  onChange={e => setFormData({...formData, backdropUrl: e.target.value})}
                  className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Trailer URL</Label>
                <Input 
                   placeholder="https://..."
                   value={formData.trailerUrl} 
                   onChange={e => setFormData({...formData, trailerUrl: e.target.value})}
                   className="bg-gray-950 border-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Preview Video URL</Label>
                <Input 
                   placeholder="https://..."
                   value={formData.previewVideoUrl} 
                   onChange={e => setFormData({...formData, previewVideoUrl: e.target.value})}
                   className="bg-gray-950 border-gray-800"
                />
              </div>
            </div>
             
             {/* Genres */}
             <div className="space-y-3">
              <Label className="text-gray-300">Genres</Label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-950 border border-gray-800 rounded-lg">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.genreIds?.includes(genre.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Cast & Crew */}
        <Card className="bg-gray-900 border-gray-800">
           <CardHeader>
            <CardTitle className="text-xl text-gray-200">Cast & Crew</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label className="text-gray-300">Director(s)</Label>
              <Input 
                 placeholder="Christopher Nolan..."
                 value={directorInput} 
                 onChange={e => setDirectorInput(e.target.value)}
                 className="bg-gray-950 border-gray-800"
              />
              <p className="text-xs text-gray-500">Separate multiple directors with commas.</p>
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <Label className="text-gray-300">Cast Members</Label>
                 <Button type="button" variant="outline" size="sm" onClick={addCastRow} className="text-xs">
                   <Plus className="w-3 h-3 mr-1" /> Add Actor
                 </Button>
               </div>
               
               <div className="space-y-3">
                 {castInput.map((row, index) => (
                   <div key={index} className="flex gap-2 items-start">
                     <Input 
                       placeholder="Actor Name"
                       value={row.name}
                       onChange={e => handleCastChange(index, 'name', e.target.value)}
                       className="flex-1 bg-gray-950 border-gray-800"
                     />
                     <Input 
                       placeholder="Role / Character"
                       value={row.role}
                       onChange={e => handleCastChange(index, 'role', e.target.value)}
                       className="flex-1 bg-gray-950 border-gray-800"
                     />
                     <Button 
                       type="button" 
                       variant="destructive" 
                       size="icon" 
                       onClick={() => removeCastRow(index)}
                       className="bg-red-900/50 hover:bg-red-900 border border-red-800"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                 ))}
               </div>
            </div>

          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
           <Button type="button" variant="outline" onClick={() => router.back()} className="text-gray-400 border-gray-700 hover:text-white">
             Cancel
           </Button>
           <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={loading}>
             {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
             Update Movie
           </Button>
        </div>

      </form>
    </div>
  )
}
