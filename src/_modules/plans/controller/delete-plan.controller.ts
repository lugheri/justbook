import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PlanUseCaseFactory } from '../usecases/factories/plan-usecases.factory'
export const deletePlan = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ plan_id: z.coerce.number() })
    const { plan_id } = params.parse(request.params)

    const { removed } = await PlanUseCaseFactory.deletePlan().execute({
      plan_id,
    })
    reply.status(200).send({ removed })
  } catch (err) {
    console.log(err)
    throw err
  }
}
