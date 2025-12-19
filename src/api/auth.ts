import { axiosApi } from './axiosApi.ts';
import type { AuthResponsePayload, LoginForm } from './types/loginTypes.ts';
import type { ApiResponse } from './types/common.ts';

export const authUser = async (data: LoginForm) => {
  const response = await axiosApi.post<ApiResponse & { data: AuthResponsePayload }>('v1/auth/jwt/', data);
  return response.data;
};

export const authGoogle = async (data: { code: string; redirect_uri?: string }) => {
  const response = await axiosApi.post<ApiResponse & { data: AuthResponsePayload }>(
    'v1/auth/social/google/web/login/',
    data,
  );
  return response.data;
};

export const refreshToken = async (refresh: string) => {
  const response = await axiosApi.post<ApiResponse & { data: AuthResponsePayload }>('v1/auth/jwt/refresh/', {refresh});
  return response.data;
};
