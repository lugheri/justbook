import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../usecases/factories/user-usecases.factory'
export const listAllUsers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
    })
    const { active } = params.parse(request.params)

    const user = await UserUseCaseFactory.listAllUsers().execute({
      active,
    })
    reply.status(200).send(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}
