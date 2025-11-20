import { FastifyReply, FastifyRequest } from 'fastify'
import { TypeBusinessUseCaseFactory } from '../usecases/factories/type-business-usecases.factory'
export const listAllTypeBusiness = async (
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const type_business =
      await TypeBusinessUseCaseFactory.listAllTypeBusiness().execute()
    reply.status(200).send(type_business)
  } catch (err) {
    console.log(err)
    throw err
  }
}
