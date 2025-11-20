import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserUseCaseFactory } from '../usecases/factories/user-usecases.factory'
export const listUsers = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      active: z.coerce.number(),
      email_search: z.string(),
      name_search: z.string(),
    })
    const { page, active, email_search, name_search } = params.parse(
      request.params,
    )
    const name = name_search === 'all' ? undefined : name_search
    const email = email_search === 'all' ? undefined : email_search

    const user = await UserUseCaseFactory.listUsers().execute({
      page,
      active,
      email,
      name,
    })
    reply.status(200).send(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}
