import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { BusinessPartialDTO } from '../@dtos/BusinessDTO'
import { BusinessUseCaseFactory } from '../usecases/factories/business-usecases.factory'
export const updateBusiness = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ business_id: z.coerce.number() })
    const { business_id } = params.parse(request.params)
    const business_data = BusinessPartialDTO.parse(request.body)

    const { businessUpdated } =
      await BusinessUseCaseFactory.updateBusiness().execute({
        business_id,
        business_data,
      })
    reply.status(200).send(businessUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
