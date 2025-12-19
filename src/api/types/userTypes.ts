import z from 'zod';
import {
  AccountInfoSchema,
  ChangePasswordFormSchema,
  NewPasswordFormSchema,
  UpdateGadgetPayloadSchema,
  UpdateGadgetResponseSchema,
  UserResponseSchema,
} from '../schemas/userSchema.ts';

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type AccountInfo = z.infer<typeof AccountInfoSchema>;
export type UpdateGadgetPayload = z.infer<typeof UpdateGadgetPayloadSchema>;
export type UpdateGadgetResponse = z.infer<typeof UpdateGadgetResponseSchema>;
export type ChangePasswordForm = z.infer<typeof ChangePasswordFormSchema>;
export type NewPasswordForm = z.infer<typeof NewPasswordFormSchema>;
export type PasswordResetPayload = {
  identifier: string;
  code: string;
  password: string;
}
