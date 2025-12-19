import z from 'zod';
import { PaginationResponseSchema } from './common.ts';

export const CommodityListItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  unit: z.string(),
  has_recipe: z.boolean(),
  group: z.object({
    id: z.string(),
    name: z.string(),
  }),
  balance: z.number(),
});

export const BalanceGroupListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  commodities: z.array(CommodityListItemSchema),
});

export const BalanceResponseSchema = z.object({
  data: z.array(BalanceGroupListItemSchema),
  pagination: PaginationResponseSchema,
});
