import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProductUseCaseFactory } from '../usecases/factories/product-usecases.factory'
export const listProducts = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      active: z.coerce.number(),
      name_search: z.string(),
    })
    const { page, active, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const products = await ProductUseCaseFactory.listProduct().execute({
      page,
      active,
      name,
    })
    reply.status(200).send(products)
  } catch (err) {
    console.log(err)
    throw err
  }
}
