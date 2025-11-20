import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { CustomerPartialDTO } from '../@dtos/CustomerDTO'
import { CustomerUseCaseFactory } from '../usecases/factories/customer-usecases.factory'
export const updateCustomer = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ customer_id: z.coerce.number() })
    const { customer_id } = params.parse(request.params)
    const customer_data = CustomerPartialDTO.parse(request.body)

    const { customerUpdated } =
      await CustomerUseCaseFactory.updateCustomer().execute({
        customer_id,
        customer_data,
      })
    reply.status(200).send(customerUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
