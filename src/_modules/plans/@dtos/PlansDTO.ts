import { z } from 'zod'

export const PlanDTO = z.object({
  name: z.string(),
  description: z.string(),
  vigency: z.enum(['monthly', 'annual']).optional().default('monthly'),
  pay_day: z.coerce.number().optional().default(0),
  monthly_fee: z.string().optional().default(''),
  annual_price: z.string().optional().default(''),
  start_date: z.string().optional().default(''),
  expiration_date: z.string().optional().default(''),
})
export type PlanType = z.infer<typeof PlanDTO>
export const PlanPartialDTO = PlanDTO.partial()
export type PlanPartialType = z.infer<typeof PlanPartialDTO>
