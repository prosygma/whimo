import z from 'zod';
import { ApiResponseSchema, PaginationResponseSchema } from './common.ts';
import { CommodityListItemSchema } from './balanceSchema.ts';

export const TransactionTypeEnum = ['producer', 'downstream'] as const;
export const TransactionStatusEnum = ['pending', 'accepted', 'rejected', 'no_response'] as const;
export const TransactionActionEnum = ['buying', 'selling'] as const;
export const TransactionLocationEnum = ['qr', 'manual', 'file', 'gps'] as const;
export const TransactionTraceabilityEnum = ['full', 'conditional', 'partial', 'incomplete'] as const;
export const TransactionGadgetTypeEnum = ['phone', 'email'] as const;

export const TransactionStatusEnumSchema = z.enum(TransactionStatusEnum);
export const TraceabilityStatusEnumSchema = z.enum(TransactionTraceabilityEnum);

export const TransactionCommoditySchema = CommodityListItemSchema;

export const TransactionGadgetSchema = z.object({
  id: z.string(),
  type: z.enum(TransactionGadgetTypeEnum),
  identifier: z.string(),
  is_verified: z.boolean(),
});

export const TransactionUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  gadgets: z.array(TransactionGadgetSchema),
});

export const TransactionItemSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  type: z.enum(TransactionTypeEnum),
  status: z.enum(TransactionStatusEnum),
  action: z.enum(TransactionActionEnum),
  location: z.enum(TransactionLocationEnum),
  transaction_latitude: z.number(),
  transaction_longitude: z.number(),
  farm_latitude: z.number(),
  farm_longitude: z.number(),
  commodity: TransactionCommoditySchema,
  volume: z.number(),
  is_buying_from_farmer: z.boolean(),
  is_automatic: z.boolean().optional(),
  expires_at: z.string().nullable(),
  updated_at: z.string(),
  traceability: z.enum(TransactionTraceabilityEnum),
  seller: TransactionUserSchema,
  buyer: TransactionUserSchema,
  created_by_id: z.string(),
});

export const TransactionsResponseSchema = z.object({
  data: z.array(TransactionItemSchema),
  pagination: PaginationResponseSchema,
});

export const TraceabilityCountsResponsePayloadSchema = z.object({
  counts: z.record(z.enum(TransactionTraceabilityEnum), z.number()),
});

export const SingleTransactionResponseSchema = ApiResponseSchema.extend({
  data: TransactionItemSchema,
});
