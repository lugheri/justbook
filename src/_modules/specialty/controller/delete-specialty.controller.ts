import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SpecialtyUseCaseFactory } from '../usecases/factories/specialty-usecases.factory'
export const deleteSpecialty = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ specialty_id: z.coerce.number() })
    const { specialty_id } = params.parse(request.params)

    const { removed } = await SpecialtyUseCaseFactory.deleteSpecialty().execute(
      {
        specialty_id,
      },
    )
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
