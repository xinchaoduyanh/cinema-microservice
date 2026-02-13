import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080';

export interface Genre {
    id: string;
    name: string;
    slug: string;
}

export interface Person {
    id: string;
    name: string;
    image?: string;
    bio?: string;
}

export interface BackendMovie {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    releaseDate: string;
    duration: number;
    rating: number;
    rottenTomatoes?: number;
    trailerUrl?: string;
    backdropUrl?: string;
    posterUrl?: string;
    previewVideoUrl?: string;
    accentColor?: string;
    status: 'COMING_SOON' | 'NOW_SHOWING' | 'ENDED';
    ageRating: 'P' | 'C13' | 'C16' | 'C18';
    stills: string[];
    movieGenres?: { genre: Genre }[];
    directors?: { director: Person }[];
    cast?: { person: Person, roleName: string }[];
}

// Map backend format to expectations of existing components
export const mapMovieData = (m: BackendMovie) => ({
    ...m,
    id: m.id,
    duration: `${m.duration} min`,
    genre: m.movieGenres?.map(mg => mg.genre.name) || [],
    status: m.status === 'NOW_SHOWING' ? 'now-playing' : 'coming-soon',
    director: {
        name: m.directors?.[0]?.director.name || 'Unknown',
        image: m.directors?.[0]?.director.image || 'https://images.unsplash.com/photo-1549474843-ed83443ba94a?auto=format&fit=crop&q=80&w=400'
    },
    cast: m.cast?.map(c => ({
        name: c.person.name,
        role: c.roleName,
        image: c.person.image || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
    })) || [],
    stills: m.stills || []
});

export const movieService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/movie-service/api/movies`);
        return (response.data as BackendMovie[]).map(mapMovieData);
    },

    getOne: async (id: string) => {
        const response = await axios.get(`${API_URL}/movie-service/api/movies/${id}`);
        return mapMovieData(response.data as BackendMovie);
    },

    getNowShowing: async () => {
        const all = await movieService.getAll();
        return all.filter(m => m.status === 'now-playing');
    },

    getComingSoon: async () => {
        const all = await movieService.getAll();
        return all.filter(m => m.status === 'coming-soon');
    }
};
