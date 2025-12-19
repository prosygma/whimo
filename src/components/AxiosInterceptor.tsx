import React, { useEffect, useState, useRef, useCallback } from 'react';
import { axiosApi } from '../api/axiosApi';
import { refreshToken } from '../api/auth.ts';
import { useTokens } from '../hooks/useTokens.ts';
import { useNavigate } from 'react-router';

export const AxiosInterceptor: React.FC = () => {
  const { setTokens, logout } = useTokens();
  const navigate = useNavigate();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const failedQueueRef = useRef<Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }>>([]);

  const processQueue = (error: unknown = null) => {
    failedQueueRef.current.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve();
      }
    });
    failedQueueRef.current = [];
  };

  const refreshTokenHandler = useCallback(async (): Promise<string> => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const { data } = await refreshToken(refresh);
    if (data && data.access && data.refresh) {
      setTokens(data.access, data.refresh);
    }

    return data.access;
  }, [setTokens]);

  useEffect(() => {
    const responseInterceptor = axiosApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          error.response?.data?.code === 'drf.token_not_valid' &&
          !originalRequest._retry
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueueRef.current.push({ resolve, reject });
            })
              .then(() => axiosApi(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          setIsRefreshing(true);

          try {
            const newAccessToken = await refreshTokenHandler();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue();
            return axiosApi(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError);
            logout();
            navigate('/login');
            return Promise.reject(refreshError);
          } finally {
            setIsRefreshing(false);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosApi.interceptors.response.eject(responseInterceptor);
    };
  }, [isRefreshing, logout, navigate, refreshTokenHandler]);

  return null;
};

export default AxiosInterceptor;
