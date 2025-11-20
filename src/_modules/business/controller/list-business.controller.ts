import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { BusinessUseCaseFactory } from '../usecases/factories/business-usecases.factory'
export const listBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      active: z.coerce.number(),
      agreed: z.coerce.number(),
      name_search: z.string(),
    })
    const { page, active, agreed, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const business = await BusinessUseCaseFactory.listBusiness().execute({
      page,
      active,
      agreed,
      name,
    })
    reply.status(200).send(business)
  } catch (err) {
    console.log(err)
    throw err
  }
}
