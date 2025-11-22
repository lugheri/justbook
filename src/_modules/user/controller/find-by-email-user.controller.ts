import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../usecases/factories/user-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const findByEmail = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ email: z.string() })
    const { email } = params.parse(request.params)
    const { user } = await UserUseCaseFactory.findByEmail().execute({
      email,
    })
    reply.status(200).send(user)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({ error: true, message: err.message })
    }
    throw err
  }
}
