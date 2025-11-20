import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TypeBusinessPartialDTO } from '../@dtos/TypeBusinessDTO'
import { TypeBusinessUseCaseFactory } from '../usecases/factories/type-business-usecases.factory'
export const updateTypeBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ type_business_id: z.coerce.number() })
    const { type_business_id } = params.parse(request.params)
    const type_business_data = TypeBusinessPartialDTO.parse(request.body)

    const { typeBusinessUpdated } =
      await TypeBusinessUseCaseFactory.updateTypeBusiness().execute({
        type_business_id,
        type_business_data,
      })
    reply.status(200).send(typeBusinessUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
