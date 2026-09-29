import { axiosApi } from './axiosApi.ts';
import type { OtpChannel, OtpSentResponse, RegistrationPayload } from './types/registrationTypes.ts';
import type { PasswordResetPayload } from './types/userTypes.ts';

export const registerUser = async (data: RegistrationPayload) => {
  await axiosApi.post('v1/auth/registration/', data);
};

export const requestVerificationCode = async (identifier: string): Promise<OtpChannel | undefined> => {
  const response = await axiosApi.post<OtpSentResponse>('v1/auth/otp/send/', { identifier });
  return response.data?.channel;
};

export const confirmGadget = async (data: Pick<PasswordResetPayload, 'identifier' | 'code'>) => {
  await axiosApi.post('v1/auth/otp/verify/', data);
};
