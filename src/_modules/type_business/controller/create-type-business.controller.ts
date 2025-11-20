import { FastifyReply, FastifyRequest } from 'fastify'
import { TypeBusinessDTO } from '../@dtos/TypeBusinessDTO'
import { TypeBusinessAlreadyExistsError } from '../errors/type-business-already-exists-error'
import { TypeBusinessUseCaseFactory } from '../usecases/factories/type-business-usecases.factory'

export const createTypeBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataTypeBusiness = TypeBusinessDTO.parse(request.body)
    const { typeBusinessCreated } =
      await TypeBusinessUseCaseFactory.createTypeBusiness().execute({
        dataTypeBusiness,
      })

    reply.status(201).send(typeBusinessCreated)
  } catch (err) {
    if (err instanceof TypeBusinessAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
