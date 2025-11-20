import { FastifyReply, FastifyRequest } from 'fastify'
import { CustomerDTO } from '../@dtos/CustomerDTO'
import { CustomerAlreadyExistsError } from '../errors/customer-already-exists-error'
import { CustomerUseCaseFactory } from '../usecases/factories/customer-usecases.factory'

export const createCustomer = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataCustomer = CustomerDTO.parse(request.body)
    const { customerCreated } =
      await CustomerUseCaseFactory.createCustomer().execute({
        dataCustomer,
      })

    reply.status(201).send(customerCreated)
  } catch (err) {
    if (err instanceof CustomerAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
