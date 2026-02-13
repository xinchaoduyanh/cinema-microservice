import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080';

export interface Cinema {
    id: string;
    name: string;
    address: string;
    city?: string;
    description?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
}

export const cinemaService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/cinema-service/api/cinemas`);
        return response.data as Cinema[];
    }
};
