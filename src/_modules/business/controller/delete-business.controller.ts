import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { BusinessUseCaseFactory } from '../usecases/factories/business-usecases.factory'
export const deleteBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ business_id: z.coerce.number() })
    const { business_id } = params.parse(request.params)

    const { removed } = await BusinessUseCaseFactory.deleteBusiness().execute({
      business_id,
    })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
