import { z } from 'zod'

export const ProfessionalDTO = z.object({
  business_id: z.number(),
  name: z.string(),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  whatsapp: z.string().optional().default(''),
  photo_profile: z.number(),
  active: z.number(),
})
export type ProfessionalType = z.infer<typeof ProfessionalDTO>
export const ProfessionalPartialDTO = ProfessionalDTO.partial()
export type ProfessionalPartialType = z.infer<typeof ProfessionalPartialDTO>
