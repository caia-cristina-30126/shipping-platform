import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  quantity: z.coerce.number().min(0, 'Quantity must be 0 or more'),
});

export type ProductSchema = z.infer<typeof productSchema>;