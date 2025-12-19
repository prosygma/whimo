import axios from 'axios';
import { LANGUAGE_STORAGE_KEY } from '../components/LanguageProvider.tsx';

export const axiosApi = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL,
});

axiosApi.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/jwt/refresh/')) {
    return config;
  }

  const accessToken = localStorage.getItem('accessToken');
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (storedLanguage) {
    config.headers['Accept-Language'] = storedLanguage;
  }
  return config;
});
