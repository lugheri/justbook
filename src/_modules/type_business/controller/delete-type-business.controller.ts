import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TypeBusinessUseCaseFactory } from '../usecases/factories/type-business-usecases.factory'
export const deleteTypeBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ type_business_id: z.coerce.number() })
    const { type_business_id } = params.parse(request.params)

    const { removed } =
      await TypeBusinessUseCaseFactory.deleteTypeBusiness().execute({
        type_business_id,
      })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
