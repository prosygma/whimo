import z from 'zod';
import { AuthResponseSchema, LoginFormSchema } from '../schemas/loginSchema.ts';

export type LoginForm = z.infer<typeof LoginFormSchema>;
export type AuthResponsePayload = z.infer<typeof AuthResponseSchema>;