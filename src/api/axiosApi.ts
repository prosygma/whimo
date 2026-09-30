import axios from 'axios';
import i18next from 'i18next';

export const axiosApi = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL,
});

axiosApi.interceptors.request.use((config) => {
  if (config.url?.includes('/auth/jwt/refresh/')) {
    return config;
  }

  const accessToken = localStorage.getItem('accessToken');
  // The language shown, always one enabled in the admin (not a stale stored choice).
  const language = i18next.language;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  if (language) {
    config.headers['Accept-Language'] = language;
  }
  return config;
});
