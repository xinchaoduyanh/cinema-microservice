import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080';

export interface Booking {
    id: string;
    userId: string;
    showtimeId: string;
    status: string;
    totalAmount: number;
    discountAmount: number;
    createdAt: string;
    items: any[];
}

export const bookingService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/booking-service/api/bookings`);
        return response.data as Booking[];
    },

    getOne: async (id: string) => {
        const response = await axios.get(`${API_URL}/booking-service/api/bookings/${id}`);
        return response.data as Booking;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await axios.patch(`${API_URL}/booking-service/api/bookings/${id}/status`, { status });
        return response.data;
    }
};
