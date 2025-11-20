import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PlanUseCaseFactory } from '../usecases/factories/plan-usecases.factory'
export const listPlans = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      page: z.coerce.number(),
      status: z.enum(['active', 'expired', 'all']),
      vigency: z.enum(['monthly', 'annual', 'all']),
      name_search: z.string(),
    })
    const { page, status, vigency, name_search } = params.parse(request.params)
    const name = name_search === 'all' ? undefined : name_search

    const plan = await PlanUseCaseFactory.listPlans().execute({
      page,
      status,
      vigency,
      name,
    })
    reply.status(200).send(plan)
  } catch (err) {
    console.log(err)
    throw err
  }
}
