import { FastifyReply, FastifyRequest } from 'fastify'
import { BusinessDTO } from '../@dtos/BusinessDTO'
import { BusinessUseCaseFactory } from '../usecases/factories/business-usecases.factory'

export const createBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataBusiness = BusinessDTO.parse(request.body)
    const { businessCreated } =
      await BusinessUseCaseFactory.createBusiness().execute({ dataBusiness })

    reply.status(201).send(businessCreated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
