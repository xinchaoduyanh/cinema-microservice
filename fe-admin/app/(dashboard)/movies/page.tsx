"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreVertical, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { movieService, Movie } from "@/services/movie.service"
import { useRouter } from "next/navigation"

export default function MoviesPage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const data = await movieService.getAll({ search })
      setMovies(data)
    } catch (error) {
      console.error("Failed to fetch movies", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [search])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        await movieService.delete(id)
        fetchMovies()
      } catch (error) {
        console.error("Failed to delete movie", error)
        alert("Failed to delete movie")
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Movies Management</h1>
          <p className="text-gray-400">Manage your cinema's movie catalog</p>
        </div>
        <Link href="/movies/create">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Add New Movie
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 glass p-5 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search movies by title..." 
            className="pl-10 bg-white/5 border-white/10 focus:bg-white/10 focus:border-white/20 rounded-xl h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-300 uppercase font-medium text-xs tracking-wider">
              <tr>
                <th className="px-6 py-5">Title</th>
                <th className="px-6 py-5">Release Date</th>
                <th className="px-6 py-5 text-center">Duration</th>
                <th className="px-6 py-5 text-center">Rating</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center">Loading movies...</td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center">No movies found.</td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-all duration-200 group">
                    <td className="px-6 py-5 font-medium text-white">
                      <div className="flex items-center gap-3">
                        {movie.posterUrl && (
                          <img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 object-cover rounded-lg bg-white/5 ring-1 ring-white/10 group-hover:ring-white/20 transition-all" />
                        )}
                        <div>
                          <div className="font-semibold">{movie.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{movie.originalTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-center font-medium">{movie.duration}m</td>
                    <td className="px-6 py-5 text-center">
                      <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-yellow-500/20">
                        {movie.ageRating}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        movie.status === 'NOW_SHOWING' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {movie.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-xl border-white/10 text-gray-200">
                          <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 rounded-lg" onClick={() => router.push(`/movies/${movie.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:text-red-400 hover:bg-white/5 focus:bg-white/5 rounded-lg" onClick={() => handleDelete(movie.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
