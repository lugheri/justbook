/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = z.object({
      business_id: z.coerce.number(),
      user_id: z.coerce.number(),
    })
    const { business_id, user_id } = params.parse(request.body)
    // Cria o log de logout
    console.log(business_id, user_id)
    reply.send({ success: true })
  } catch (error: any) {
    console.log(error)
    throw error
  }
}
