import { z } from 'zod'

export const TypeBusinessDTO = z.object({
  name: z.string(),
  description: z.string(),
})
export type TypeBusinessType = z.infer<typeof TypeBusinessDTO>
export const TypeBusinessPartialDTO = TypeBusinessDTO.partial()
export type TypeBusinessPartialType = z.infer<typeof TypeBusinessPartialDTO>
