import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { PlanEntity } from '../entities/Plans.entity'
import { IPlanRepository } from '../repositories/interfaces/iplan.repository'

interface Request {
  plan_id: number
}

interface Response {
  plan: PlanEntity
}

export class GetPlanUseCase {
  constructor(private planRepository: IPlanRepository) {}
  async execute({ plan_id }: Request): Promise<Response> {
    const plan = await this.planRepository.get(plan_id)
    if (!plan) {
      throw new ResourceNotFoundError()
    }
    return { plan }
  }
}
