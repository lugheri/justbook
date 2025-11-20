import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProductUseCaseFactory } from '../usecases/factories/product-usecases.factory'
export const deleteProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ product_id: z.coerce.number() })
    const { product_id } = params.parse(request.params)

    const { removed } = await ProductUseCaseFactory.deleteProduct().execute({
      product_id,
    })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
