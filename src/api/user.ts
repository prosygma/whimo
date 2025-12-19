import { axiosApi } from './axiosApi.ts';
import type { ApiResponse } from './types/common.ts';
import type {
  ChangePasswordForm,
  PasswordResetPayload,
  UpdateGadgetPayload,
  UpdateGadgetResponse,
  UserResponse,
} from './types/userTypes.ts';

export const fetchProfileData = async (): Promise<{ data: UserResponse }> => {
  const response = await axiosApi.get<ApiResponse & { data: UserResponse }>('v1/users/profile/');
  return response.data;
};

export const updateGadget = async (data: UpdateGadgetPayload) => {
  const response = await axiosApi.post<ApiResponse & { data: UpdateGadgetResponse }>('v1/users/gadgets/', data);
  return response.data;
};

export const deleteGadget = async (identifier: string) => {
  await axiosApi.delete('v1/users/gadgets/', { data: { identifier } });
};

export const sendVerificationCode = async (identifier: string) => {
  await axiosApi.post('v1/auth/otp/send/', { identifier });
};

export const verifyGadget = async (code: string, identifier: string) => {
  await axiosApi.post('v1/auth/otp/verify/', { code, identifier });
};

export const changePassword = async (data: Omit<ChangePasswordForm, 'confirm_password'>) => {
  await axiosApi.patch('v1/users/profile/password/', data);
};

export const deleteAccount = async () => {
  await axiosApi.delete('v1/users/profile/');
};

export const passwordResetSendOtp = async (data: Pick<PasswordResetPayload, 'identifier'>) => {
  await axiosApi.post('v1/auth/otp/password-reset/send/', data);
};

export const passwordResetVerifyOtp = async (data: Pick<PasswordResetPayload, 'identifier' | 'code'>) => {
  await axiosApi.post('v1/auth/otp/password-reset/check/', data);
};

export const passwordResetSetNewPassword = async (data: PasswordResetPayload) => {
  await axiosApi.post('v1/auth/otp/password-reset/verify/', data);
};
