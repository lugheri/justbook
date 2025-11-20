import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProductUseCaseFactory } from '../usecases/factories/product-usecases.factory'
export const listAllProducts = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
    })
    const { active } = params.parse(request.params)

    const products = await ProductUseCaseFactory.listAllProduct().execute({
      active,
    })
    reply.status(200).send(products)
  } catch (err) {
    console.log(err)
    throw err
  }
}
