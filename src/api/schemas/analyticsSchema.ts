import z from 'zod';
import { ApiResponseSchema } from './common.ts';

export const AnalyticsSummarySchema = z.object({
  total_transactions: z.number(),
  total_suppliers: z.number(),
  initial_plots: z.number(),
  files_uploaded: z.number(),
});

export const AnalyticsSummaryResponseSchema = ApiResponseSchema.extend({
  data: AnalyticsSummarySchema,
});
