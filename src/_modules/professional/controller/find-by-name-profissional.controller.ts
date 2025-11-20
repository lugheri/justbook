import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProfessionalUseCaseFactory } from '../usecases/factories/profissional-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const findByName = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ name: z.string() })
    const { name } = params.parse(request.params)
    const { professional } =
      await ProfessionalUseCaseFactory.findByName().execute({
        name,
      })
    reply.status(200).send(professional)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
