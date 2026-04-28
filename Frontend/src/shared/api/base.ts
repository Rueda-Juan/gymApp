import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { clearAuthStorage, getAccessToken } from '../lib/auth';

// En Expo, localhost no funciona en Android real; usamos la IP local de la máquina
const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Peticiones
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      console.error('[API Error Response]:', error.response.status, error.response.data);

      if (error.response.status === 401) {
        await clearAuthStorage();
      }
    } else if (error.request) {
      console.error('[API No Response]:', error.request);
    } else {
      console.error('[API Request Config Error]:', error.message);
    }

    return Promise.reject(error);
  }
);
