import z from 'zod';
import { AnalyticsSummaryResponseSchema, AnalyticsSummarySchema } from '../schemas/analyticsSchema.ts';

export type AnalyticsSummary = z.infer<typeof AnalyticsSummarySchema>;
export type AnalyticsSummaryResponse = z.infer<typeof AnalyticsSummaryResponseSchema>;