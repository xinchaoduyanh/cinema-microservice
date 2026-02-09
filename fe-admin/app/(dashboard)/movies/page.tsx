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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Movies Management</h1>
          <p className="text-gray-400">Manage your cinema's movie catalog</p>
        </div>
        <Link href="/movies/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Movie
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search movies..." 
            className="pl-9 bg-gray-950 border-gray-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/40 backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-950 text-gray-200 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Release Date</th>
                <th className="px-6 py-4 text-center">Duration</th>
                <th className="px-6 py-4 text-center">Rating</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
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
                  <tr key={movie.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <div className="flex items-center gap-3">
                        {movie.posterUrl && (
                          <img src={movie.posterUrl} alt={movie.title} className="w-8 h-12 object-cover rounded bg-gray-800" />
                        )}
                        <div>
                          <div>{movie.title}</div>
                          <div className="text-xs text-gray-500">{movie.originalTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">{movie.duration}m</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20">
                        {movie.ageRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs border ${
                        movie.status === 'NOW_SHOWING' 
                          ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {movie.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-200">
                          <DropdownMenuItem onClick={() => router.push(`/movies/${movie.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={() => handleDelete(movie.id)}>
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
