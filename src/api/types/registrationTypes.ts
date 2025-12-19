import z from 'zod';
import { RegistrationFormSchema } from '../schemas/registrationSchema.ts';

export type RegistrationForm = z.infer<typeof RegistrationFormSchema>;
export type RegistrationPayload = Omit<RegistrationForm, 'confirmPassword'>;