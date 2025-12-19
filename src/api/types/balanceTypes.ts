import z from 'zod';
import {
  BalanceGroupListItemSchema,
  BalanceResponseSchema,
  CommodityListItemSchema,
} from '../schemas/balanceSchema.ts';

export type BalanceGroupCommodityItem = z.infer<typeof CommodityListItemSchema>;
export type BalanceGroupListItem = z.infer<typeof BalanceGroupListItemSchema>;
export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;
