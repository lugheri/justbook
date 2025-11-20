import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TypeBusinessUseCaseFactory } from '../usecases/factories/type-business-usecases.factory'
export const listTypeBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      name_search: z.string(),
    })
    const { page, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const type_business =
      await TypeBusinessUseCaseFactory.listTypeBusiness().execute({
        page,
        name,
      })
    reply.status(200).send(type_business)
  } catch (err) {
    console.log(err)
    throw err
  }
}
