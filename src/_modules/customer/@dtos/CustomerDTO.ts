import { z } from 'zod'

export const CustomerDTO = z.object({
  business_id: z.number(),
  name: z.string(),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  whatsapp: z.string().optional().default(''),
  notes: z.string().optional().default(''),
})
export type CustomerType = z.infer<typeof CustomerDTO>
export const CustomerPartialDTO = CustomerDTO.partial()
export type CustomerPartialType = z.infer<typeof CustomerPartialDTO>
