import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { BusinessUseCaseFactory } from '../usecases/factories/business-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ business_id: z.coerce.number() })
    const { business_id } = params.parse(request.params)
    const { business } = await BusinessUseCaseFactory.getBusiness().execute({
      business_id,
    })
    reply.status(200).send(business)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
