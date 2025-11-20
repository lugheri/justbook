import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProfessionalUseCaseFactory } from '../usecases/factories/profissional-usecases.factory'
export const listAllProfessionals = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
    })
    const { active } = params.parse(request.params)

    const professional =
      await ProfessionalUseCaseFactory.listAllProfessional().execute({
        active,
      })
    reply.status(200).send(professional)
  } catch (err) {
    console.log(err)
    throw err
  }
}
