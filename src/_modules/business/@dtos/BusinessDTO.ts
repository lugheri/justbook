import { z } from 'zod'

export const BusinessDTO = z.object({
  business_name: z.string(),
  company_name: z.string(),
  type_business: z.number().optional().default(0),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  whatsapp: z.string().optional().default(''),
  address: z.string().optional().default(''),
  address_2: z.string().optional().default(''),
  plan: z.number().optional().default(0),
  terms_agreed: z.number(),
  active: z.number(),
})
export type BusinessType = z.infer<typeof BusinessDTO>
export const BusinessPartialDTO = BusinessDTO.partial()
export type BusinessPartialType = z.infer<typeof BusinessPartialDTO>
