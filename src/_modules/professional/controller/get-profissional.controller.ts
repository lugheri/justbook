import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProfessionalUseCaseFactory } from '../usecases/factories/profissional-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getProfessional = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ professional_id: z.coerce.number() })
    const { professional_id } = params.parse(request.params)
    const { professional } =
      await ProfessionalUseCaseFactory.getProfessional().execute({
        professional_id,
      })
    reply.status(200).send(professional)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
