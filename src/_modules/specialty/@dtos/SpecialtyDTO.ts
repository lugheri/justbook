import { z } from 'zod'

export const SpecialtyDTO = z.object({
  name: z.string(),
  description: z.string().optional().default(''),
  active: z.number(),
})
export type SpecialtyType = z.infer<typeof SpecialtyDTO>
export const SpecialtyPartialDTO = SpecialtyDTO.partial()
export type SpecialtyPartialType = z.infer<typeof SpecialtyPartialDTO>
