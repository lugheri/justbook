import { FastifyReply, FastifyRequest } from 'fastify'
import { PlanDTO } from '../@dtos/PlansDTO'
import { PlanUseCaseFactory } from '../usecases/factories/plan-usecases.factory'

export const createPlan = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const dataPlan = PlanDTO.parse(request.body)
    const { planCreated } = await PlanUseCaseFactory.createPlan().execute({
      dataPlan,
    })

    reply.status(201).send(planCreated)
  } catch (err) {
    console.log(err)
    throw err
  }
}
