import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProductPartialDTO } from '../@dtos/ProductDTO'
import { ProductUseCaseFactory } from '../usecases/factories/product-usecases.factory'
export const updateProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ product_id: z.coerce.number() })
    const { product_id } = params.parse(request.params)
    const product_data = ProductPartialDTO.parse(request.body)

    const { productUpdated } =
      await ProductUseCaseFactory.updateProduct().execute({
        product_id,
        product_data,
      })
    reply.status(200).send(productUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
