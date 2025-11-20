import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { BusinessUseCaseFactory } from '../usecases/factories/business-usecases.factory'
export const listAllBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
      agreed: z.coerce.number().default(1),
    })
    const { active, agreed } = params.parse(request.params)

    const business = await BusinessUseCaseFactory.listAllBusiness().execute({
      active,
      agreed,
    })
    reply.status(200).send(business)
  } catch (err) {
    console.log(err)
    throw err
  }
}
