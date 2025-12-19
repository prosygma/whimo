import z from 'zod';

export const LoginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const AuthResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});
