import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PlanUseCaseFactory } from '../usecases/factories/plan-usecases.factory'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export const getPlan = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = z.object({ plan_id: z.coerce.number() })
    const { plan_id } = params.parse(request.params)
    const { plan } = await PlanUseCaseFactory.getPlan().execute({
      plan_id,
    })
    reply.status(200).send(plan)
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404)
    }
    throw err
  }
}
