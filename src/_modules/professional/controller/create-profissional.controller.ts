import { FastifyReply, FastifyRequest } from 'fastify'
import { ProfessionalDTO } from '../@dtos/ProfessionalDTO'
import { ProfessionalAlreadyExistsError } from '../errors/professional-already-exists-error'
import { ProfessionalUseCaseFactory } from '../usecases/factories/profissional-usecases.factory'

export const createProfessional = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataProfessional = ProfessionalDTO.parse(request.body)
    const { professionalCreated } =
      await ProfessionalUseCaseFactory.createProfessional().execute({
        dataProfessional,
      })

    reply.status(201).send(professionalCreated)
  } catch (err) {
    if (err instanceof ProfessionalAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
