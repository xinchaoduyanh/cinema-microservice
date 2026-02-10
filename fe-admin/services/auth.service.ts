import api from '@/lib/axios';

export interface LoginParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email?: string;
}

export const authService = {
  login: async (data: LoginParams) => {
    const response = await api.post<AuthResponse>('/auth-service/api/auth/login', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
