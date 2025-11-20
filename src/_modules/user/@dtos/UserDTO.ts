import { z } from 'zod'

export const UserDTO = z.object({
  business_id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional().default(''),
  whatsapp: z.string().optional().default(''),
  password: z.string(),
  reset: z.number().optional().default(0),
  photo_profile: z.number().optional().default(0),
  active: z.number().optional().default(1),
})
export type UserType = z.infer<typeof UserDTO>
export const UserPartialDTO = UserDTO.partial()
export type UserPartialType = z.infer<typeof UserPartialDTO>
