import { PlanPartialType } from '../@dtos/PlansDTO'
import { PlanEntity } from '../entities/Plans.entity'
import { IPlanRepository } from '../repositories/interfaces/iplan.repository'

interface Request {
  plan_id: number
  plan_data: PlanPartialType
}
interface Response {
  planUpdated: PlanEntity
}

export class UpdatePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}
  async execute({ plan_id, plan_data }: Request): Promise<Response> {
    const planUpdated = await this.planRepository.update(plan_id, plan_data)
    return { planUpdated }
  }
}
