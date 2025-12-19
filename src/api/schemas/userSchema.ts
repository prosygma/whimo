import z from 'zod';

export const GadgetTypeEnum = {
  PHONE: 'phone',
  EMAIL: 'email',
} as const;

export const GadgetSchema = z.object({
  id: z.string(),
  type: z.enum(Object.values(GadgetTypeEnum)),
  identifier: z.string(),
  is_verified: z.boolean(),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  gadgets: z.array(GadgetSchema),
});

export const AccountInfoSchema = z.object({
  user_id: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const UpdateGadgetPayloadSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
});

export const UpdateGadgetResponseSchema = GadgetSchema;

export const ChangePasswordFormSchema = z.object({
  current_password: z.string().min(1, {error: 'This field is required'}),
  new_password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters long' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      error: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
    }),
  confirm_password: z.string(),
}).refine(({ new_password, confirm_password }) => new_password === confirm_password, {
  path: ['confirm_password'],
  message: 'Passwords do not match',
});

export const NewPasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters long' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      error: 'Password must contain at least one uppercase letter, one lowercase letter and one number',
    }),
  confirm_password: z.string(),
}).refine(({ password, confirm_password }) => password === confirm_password, {
  path: ['confirm_password'],
  message: 'Passwords do not match',
});
