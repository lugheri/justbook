import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SpecialtyPartialDTO } from '../@dtos/SpecialtyDTO'
import { SpecialtyUseCaseFactory } from '../usecases/factories/specialty-usecases.factory'
export const updateSpecialty = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ specialty_id: z.coerce.number() })
    const { specialty_id } = params.parse(request.params)
    const specialty_data = SpecialtyPartialDTO.parse(request.body)

    const { specialtyUpdated } =
      await SpecialtyUseCaseFactory.updateSpecialty().execute({
        specialty_id,
        specialty_data,
      })
    reply.status(200).send(specialtyUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
