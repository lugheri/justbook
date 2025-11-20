import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProfessionalUseCaseFactory } from '../usecases/factories/profissional-usecases.factory'
export const deleteProfessional = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ professional_id: z.coerce.number() })
    const { professional_id } = params.parse(request.params)

    const { removed } =
      await ProfessionalUseCaseFactory.deleteProfessional().execute({
        professional_id,
      })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
