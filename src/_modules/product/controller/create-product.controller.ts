import { FastifyReply, FastifyRequest } from 'fastify'
import { ProductDTO } from '../@dtos/ProductDTO'
import { ProductAlreadyExistsError } from '../errors/product-already-exists-error'
import { ProductUseCaseFactory } from '../usecases/factories/product-usecases.factory'

export const createProduct = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataProduct = ProductDTO.parse(request.body)
    const { productCreated } =
      await ProductUseCaseFactory.createProduct().execute({
        dataProduct,
      })

    reply.status(201).send(productCreated)
  } catch (err) {
    if (err instanceof ProductAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
