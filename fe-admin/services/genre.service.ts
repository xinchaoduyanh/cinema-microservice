
import api from '@/lib/axios';

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export const genreService = {
  getAll: async () => {
    const response = await api.get<Genre[]>('/movie-service/api/genres');
    return response.data;
  }
};
