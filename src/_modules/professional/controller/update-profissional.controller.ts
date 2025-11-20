import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProfessionalPartialDTO } from '../@dtos/ProfessionalDTO'
import { ProfessionalUseCaseFactory } from '../usecases/factories/profissional-usecases.factory'
export const updateProfessional = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ professional_id: z.coerce.number() })
    const { professional_id } = params.parse(request.params)
    const professional_data = ProfessionalPartialDTO.parse(request.body)

    const { professionalUpdated } =
      await ProfessionalUseCaseFactory.updateProfessional().execute({
        professional_id,
        professional_data,
      })
    reply.status(200).send(professionalUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
