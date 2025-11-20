import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PlanUseCaseFactory } from '../usecases/factories/plan-usecases.factory'
export const listAllPlans = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({
      active: z.coerce.number().default(1),
    })
    const { active } = params.parse(request.params)

    const plan = await PlanUseCaseFactory.listAllPlans().execute({
      active,
    })
    reply.status(200).send(plan)
  } catch (err) {
    console.log(err)
    throw err
  }
}
