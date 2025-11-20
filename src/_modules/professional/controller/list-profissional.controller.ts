import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { ProfessionalUseCaseFactory } from '../usecases/factories/profissional-usecases.factory'
export const listProfessionals = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      active: z.coerce.number(),
      name_search: z.string(),
    })
    const { page, active, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const professional =
      await ProfessionalUseCaseFactory.listProfessional().execute({
        page,
        active,
        name,
      })
    reply.status(200).send(professional)
  } catch (err) {
    console.log(err)
    throw err
  }
}
