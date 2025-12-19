import z from 'zod';
import {
  SingleTransactionResponseSchema,
  TraceabilityCountsResponsePayloadSchema,
  TraceabilityStatusEnumSchema,
  TransactionItemSchema,
  TransactionsResponseSchema,
  TransactionStatusEnumSchema,
  TransactionUserSchema,
} from '../schemas/transactionSchema.ts';

export type TransactionUser = z.infer<typeof TransactionUserSchema>;
export type TransactionItem = z.infer<typeof TransactionItemSchema>;
export type TransactionsResponse = z.infer<typeof TransactionsResponseSchema>;
export type SingleTransactionResponse = z.infer<typeof SingleTransactionResponseSchema>;

export type TransactionStatusEnum = z.infer<typeof TransactionStatusEnumSchema>;
export type TraceabilityStatusEnum = z.infer<typeof TraceabilityStatusEnumSchema>;
export type TraceabilityCountsResponsePayload = z.infer<typeof TraceabilityCountsResponsePayloadSchema>;