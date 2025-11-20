import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { CustomerUseCaseFactory } from '../usecases/factories/customer-usecases.factory'
export const listCustomers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      name_search: z.string(),
    })
    const { page, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const customers = await CustomerUseCaseFactory.listCustomer().execute({
      page,
      name,
    })
    reply.status(200).send(customers)
  } catch (err) {
    console.log(err)
    throw err
  }
}
