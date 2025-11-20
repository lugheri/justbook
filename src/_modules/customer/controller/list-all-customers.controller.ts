import { FastifyReply, FastifyRequest } from 'fastify'
import { CustomerUseCaseFactory } from '../usecases/factories/customer-usecases.factory'
export const listAllCustomers = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const customers = await CustomerUseCaseFactory.listAllCustomer().execute()
    reply.status(200).send(customers)
  } catch (err) {
    console.log(err)
    throw err
  }
}
