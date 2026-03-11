import api from '@/lib/axios';

export interface Cinema {
    id: string;
    name: string;
    address: string;
    city?: string;
    description?: string;
    imageUrl?: string;
}

export interface Room {
    id: string;
    name: string;
    screenType: string;
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

export interface GenerateSeatsDto {
    numberOfRows: number;
    seatsPerRow: number;
    type?: string;
}

export const cinemaService = {
    // Cinemas
    getCinemas: async () => {
        const response = await api.get<Cinema[]>('/cinema-service/api/cinemas');
        return response.data;
    },
    createCinema: async (data: Partial<Cinema>) => {
        const response = await api.post<Cinema>('/cinema-service/api/cinemas', data);
        return response.data;
    },
    updateCinema: async (id: string, data: Partial<Cinema>) => {
        const response = await api.patch<Cinema>(`/cinema-service/api/cinemas/${id}`, data);
        return response.data;
    },
    removeCinema: async (id: string) => {
        const response = await api.delete(`/cinema-service/api/cinemas/${id}`);
        return response.data;
    },

    // Rooms
    getRooms: async (cinemaId: string) => {
        const response = await api.get<Room[]>(`/cinema-service/api/rooms/cinema/${cinemaId}`);
        return response.data;
    },
    createRoom: async (data: Partial<Room> & { cinemaId: string }) => {
        const response = await api.post<Room>('/cinema-service/api/rooms', data);
        return response.data;
    },
    updateRoom: async (id: string, data: Partial<Room>) => {
        const response = await api.patch<Room>(`/cinema-service/api/rooms/${id}`, data);
        return response.data;
    },
    removeRoom: async (id: string) => {
        const response = await api.delete(`/cinema-service/api/rooms/${id}`);
        return response.data;
    },
    generateSeats: async (roomId: string, data: GenerateSeatsDto) => {
        const response = await api.post(`/cinema-service/api/rooms/${roomId}/generate-seats`, data);
        return response.data;
    },

    // Seats
    getSeats: async (roomId: string) => {
        const response = await api.get<Seat[]>(`/cinema-service/api/seats/room/${roomId}`);
        return response.data;
    },

    // Showtimes
    getShowtimes: async () => {
        const response = await api.get<Showtime[]>('/cinema-service/api/showtimes');
        return response.data;
    },
    createShowtime: async (data: Partial<Showtime>) => {
        const response = await api.post<Showtime>('/cinema-service/api/showtimes', data);
        return response.data;
    },
    removeShowtime: async (id: string) => {
        const response = await api.delete(`/cinema-service/api/showtimes/${id}`);
        return response.data;
    },
};
