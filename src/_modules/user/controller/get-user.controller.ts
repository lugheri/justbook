import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../usecases/factories/user-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = z.object({ user_id: z.coerce.number() })
    const { user_id } = params.parse(request.params)
    const { user } = await UserUseCaseFactory.getUser().execute({
      user_id,
    })
    reply.status(200).send(user)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
