import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { CustomerUseCaseFactory } from '../usecases/factories/customer-usecases.factory'
export const deleteCustomer = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ customer_id: z.coerce.number() })
    const { customer_id } = params.parse(request.params)

    const { removed } = await CustomerUseCaseFactory.deleteCustomer().execute({
      customer_id,
    })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
