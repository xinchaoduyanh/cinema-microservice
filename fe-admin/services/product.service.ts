import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080';

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    imageUrl?: string;
    isActive: boolean;
}

export const productService = {
    getAll: async () => {
        const response = await axios.get(`${API_URL}/booking-service/api/products`);
        return response.data as Product[];
    },

    getOne: async (id: string) => {
        const response = await axios.get(`${API_URL}/booking-service/api/products/${id}`);
        return response.data as Product;
    },

    create: async (data: Partial<Product>) => {
        const response = await axios.post(`${API_URL}/booking-service/api/products`, data);
        return response.data as Product;
    },

    update: async (id: string, data: Partial<Product>) => {
        const response = await axios.patch(`${API_URL}/booking-service/api/products/${id}`, data);
        return response.data as Product;
    },

    delete: async (id: string) => {
        const response = await axios.delete(`${API_URL}/booking-service/api/products/${id}`);
        return response.data;
    }
};
