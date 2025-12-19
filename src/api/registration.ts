import { axiosApi } from './axiosApi.ts';
import type { RegistrationPayload } from './types/registrationTypes.ts';
import type { PasswordResetPayload } from './types/userTypes.ts';

export const registerUser = async (data: RegistrationPayload) => {
  await axiosApi.post('v1/auth/registration/', data);
};

export const requestVerificationCode = async (identifier: string) => {
  await axiosApi.post('v1/auth/otp/send/', { identifier });
};

export const confirmGadget = async (data: Pick<PasswordResetPayload, 'identifier' | 'code'>) => {
  await axiosApi.post('v1/auth/otp/verify/', data);
};
