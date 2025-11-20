import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SpecialtyUseCaseFactory } from '../usecases/factories/specialty-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getSpecialty = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ specialty_id: z.coerce.number() })
    const { specialty_id } = params.parse(request.params)
    const { specialty } = await SpecialtyUseCaseFactory.getSpecialty().execute({
      specialty_id,
    })
    reply.status(200).send(specialty)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
