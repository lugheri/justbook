import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SpecialtyUseCaseFactory } from '../usecases/factories/specialty-usecases.factory'
export const listAllSpecialties = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
    })
    const { active } = params.parse(request.params)

    const specialties =
      await SpecialtyUseCaseFactory.listAllSpecialty().execute({
        active,
      })
    reply.status(200).send(specialties)
  } catch (err) {
    console.log(err)
    throw err
  }
}
