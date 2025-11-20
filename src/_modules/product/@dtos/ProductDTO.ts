import { z } from 'zod'

export const ProductDTO = z.object({
  business_id: z.number(),
  name: z.string(),
  description: z.string().optional().default(''),
  duration_minutes: z.number(),
  professional: z.number(),
  price: z.string().optional().default(''),
  color_tag: z.string().optional().default('#3B82F6'),
  active: z.number(),
})
export type ProductType = z.infer<typeof ProductDTO>
export const ProductPartialDTO = ProductDTO.partial()
export type ProductPartialType = z.infer<typeof ProductPartialDTO>
