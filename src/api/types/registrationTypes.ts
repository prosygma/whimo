import z from 'zod';
import { RegistrationFormSchema } from '../schemas/registrationSchema.ts';

export type RegistrationForm = z.infer<typeof RegistrationFormSchema>;
export type RegistrationPayload = Omit<RegistrationForm, 'confirmPassword'>;

/** How the backend delivered a verification code (absent on older backends). */
export type OtpChannel = 'email' | 'sms' | 'whatsapp';

export type OtpSentResponse = { channel?: OtpChannel };