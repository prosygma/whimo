import z from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const RegistrationFormSchema = z
  .object({
    email: z.union([z.literal(''), z.email()]),
    phone: z.union([z.literal(''), z.string()]),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters long' })
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
        error: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
      }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'At least one field is required',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'At least one field is required',
      });
    }
  })
  .refine(({ email, phone }) => email || isValidPhoneNumber(phone), {
    path: ['phone'],
    message: 'Invalid phone number',
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
