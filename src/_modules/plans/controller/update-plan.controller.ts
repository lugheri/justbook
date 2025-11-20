import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PlanPartialDTO } from '../@dtos/PlansDTO'
import { PlanUseCaseFactory } from '../usecases/factories/plan-usecases.factory'
export const updatePlan = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const params = z.object({ plan_id: z.coerce.number() })
    const { plan_id } = params.parse(request.params)
    const plan_data = PlanPartialDTO.parse(request.body)

    const { planUpdated } = await PlanUseCaseFactory.updatePlan().execute({
      plan_id,
      plan_data,
    })
    reply.status(200).send(planUpdated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
