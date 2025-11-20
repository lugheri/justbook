import { FastifyReply, FastifyRequest } from 'fastify'
import { UserDTO } from '../@dtos/UserDTO'
import { UserUseCaseFactory } from '../usecases/factories/user-usecases.factory'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

export const createUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataUser = UserDTO.parse(request.body)
    const { userCreated } = await UserUseCaseFactory.createUser().execute({
      dataUser,
    })

    reply.status(201).send(userCreated)
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
