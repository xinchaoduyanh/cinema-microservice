import api from '@/lib/axios';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
  avatar?: string;
  createdAt?: string;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/user-service/api/user/info');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/user-service/api/user/info', data);
    return response.data;
  },
};
