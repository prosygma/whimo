import z from 'zod';
import { TransactionItemSchema, TransactionUserSchema } from './transactionSchema.ts';
import { ApiResponseSchema, PaginationResponseSchema } from './common.ts';

export const NotificationTypeEnum = ['transaction_pending', 'transaction_accepted', 'transaction_rejected', 'transaction_expired', 'geodata_missing', 'geodata_updated'] as const;
export const NotificationStatusEnum = ['pending', 'read'] as const;

export const NotificationItemSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  data: z.object({
    transaction: TransactionItemSchema,
  }),
  type: z.enum(NotificationTypeEnum),
  status: z.enum(NotificationStatusEnum),
  received_by: TransactionUserSchema,
  created_by: TransactionUserSchema,
});

export const NotificationsListSchema = z.array(NotificationItemSchema);

export const NotificationResponseSchema = ApiResponseSchema.extend({
  data: NotificationsListSchema,
  pagination: PaginationResponseSchema,
});
