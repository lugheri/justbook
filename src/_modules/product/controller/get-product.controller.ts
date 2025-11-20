import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProductUseCaseFactory } from '../usecases/factories/product-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ product_id: z.coerce.number() })
    const { product_id } = params.parse(request.params)
    const { product } = await ProductUseCaseFactory.getProduct().execute({
      product_id,
    })
    reply.status(200).send(product)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
