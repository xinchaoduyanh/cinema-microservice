
import api from '@/lib/axios';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  releaseDate: string;
  duration: number;
  ageRating: string;
  status: string;
  rating: number;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  previewVideoUrl?: string;
  longDescription?: string;
  // relations
  movieGenres?: { genre: { id: string, name: string } }[];
  directors?: { director: { name: string } }[];
  cast?: { person: { name: string }, roleName: string }[];
}

export interface CreateMoviePayload {
  title: string;
  originalTitle?: string;
  description: string;
  longDescription?: string;
  releaseDate: string;
  duration: number;
  ageRating: string;
  status: string;
  trailerUrl?: string;
  backdropUrl?: string;
  posterUrl?: string;
  previewVideoUrl?: string;
  genreIds?: string[];
  directorNames?: string[];
  cast?: { name: string, role: string }[];
}

export const movieService = {
  getAll: async (params?: any) => {
    const response = await api.get<Movie[]>('/movie-service/api/movies', { params });
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get<Movie>(`/movie-service/api/movies/${id}`);
    return response.data;
  },

  create: async (data: CreateMoviePayload) => {
    const response = await api.post<Movie>('/movie-service/api/movies', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateMoviePayload>) => {
    const response = await api.put<Movie>(`/movie-service/api/movies/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/movie-service/api/movies/${id}`);
  }
};
