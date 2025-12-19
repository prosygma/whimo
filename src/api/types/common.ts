import { ApiResponseSchema, type PaginationResponseSchema } from '../schemas/common.ts';
import z from 'zod';

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export type PaginationResponse = z.infer<typeof PaginationResponseSchema>;
