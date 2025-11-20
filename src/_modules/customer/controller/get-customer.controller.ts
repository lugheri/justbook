import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { CustomerUseCaseFactory } from '../usecases/factories/customer-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getCustomer = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ customer_id: z.coerce.number() })
    const { customer_id } = params.parse(request.params)
    const { customer } = await CustomerUseCaseFactory.getCustomer().execute({
      customer_id,
    })
    reply.status(200).send(customer)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
