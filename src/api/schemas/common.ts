import z from 'zod';

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.string().optional(),
});

export const PaginationResponseSchema = z.object({
  count: z.number(),
  page: z.number(),
  page_size: z.number(),
  next_page: z.number().nullable(),
  previous_page: z.number().nullable(),
  total_pages: z.number(),
});
