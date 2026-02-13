import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080';

export interface Cinema {
    id: string;
    name: string;
    address: string;
    description?: string;
}

export interface Room {
    id: string;
    name: string;
    cinema: Cinema;
}

export interface Seat {
    id: string;
    row: string;
    column: number;
    type: string;
    room: Room;
}

export interface Showtime {
    id: string;
    movieId: string;
    roomId: string;
    startTime: string;
    endTime: string;
    price: number;
    currency: string;
    room?: Room;
}

export const cinemaService = {
    // Cinemas
    getCinemas: async () => {
        const response = await axios.get(`${API_URL}/cinema-service/api/cinemas`);
        return response.data as Cinema[];
    },
    createCinema: async (data: Partial<Cinema>) => {
        const response = await axios.post(`${API_URL}/cinema-service/api/cinemas`, data);
        return response.data as Cinema;
    },

    // Rooms
    getRooms: async (cinemaId: string) => {
        const response = await axios.get(`${API_URL}/cinema-service/api/rooms/cinema/${cinemaId}`);
        return response.data as Room[];
    },
    createRoom: async (data: Partial<Room>) => {
        const response = await axios.post(`${API_URL}/cinema-service/api/rooms`, data);
        return response.data as Room;
    },

    // Seats
    getSeats: async (roomId: string) => {
        const response = await axios.get(`${API_URL}/cinema-service/api/seats/room/${roomId}`);
        return response.data as Seat[];
    },
    createBulkSeats: async (data: { roomId: string; rows: string[]; columns: number; type: string }) => {
        const response = await axios.post(`${API_URL}/cinema-service/api/seats/bulk`, data);
        return response.data;
    },

    // Showtimes
    getShowtimes: async () => {
        const response = await axios.get(`${API_URL}/cinema-service/api/showtimes`);
        return response.data as Showtime[];
    },
    createShowtime: async (data: Partial<Showtime>) => {
        const response = await axios.post(`${API_URL}/cinema-service/api/showtimes`, data);
        return response.data as Showtime;
    }
};
