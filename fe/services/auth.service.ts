import api from '@/lib/axios';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email?: string;
  // backend might return other fields
}

export const authService = {
  login: async (data: LoginParams) => {
    // API endpoint based on your APISIX route config
    // Assuming /auth-service/api/auth/login based on fe-admin logic
    const response = await api.post<AuthResponse>('/auth-service/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterParams) => {
    const response = await api.post<AuthResponse>('/auth-service/api/auth/sign-up', data);
    return response.data;
  },
  
  // This is a placeholder for Google OAuth if backend supported it
  // loginWithGoogle: async (idToken: string) => {
  //   const response = await api.post('/auth-service/api/auth/google', { token: idToken });
  //   return response.data;
  // },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
