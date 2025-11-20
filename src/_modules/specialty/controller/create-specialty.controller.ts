import { FastifyReply, FastifyRequest } from 'fastify'
import { SpecialtyDTO } from '../@dtos/SpecialtyDTO'
import { SpecialtyAlreadyExistsError } from '../errors/specialty-already-exists-error'
import { SpecialtyUseCaseFactory } from '../usecases/factories/specialty-usecases.factory'

export const createSpecialty = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataSpecialty = SpecialtyDTO.parse(request.body)
    const { specialtyCreated } =
      await SpecialtyUseCaseFactory.createSpecialty().execute({
        dataSpecialty,
      })

    reply.status(201).send(specialtyCreated)
  } catch (err) {
    if (err instanceof SpecialtyAlreadyExistsError) {
      return reply.status(409).send({ error: true, message: err.message })
    }
    throw err
  }
}
