import { PlanType } from '../@dtos/PlansDTO'
import { PlanEntity } from '../entities/Plans.entity'
import { IPlanRepository } from '../repositories/interfaces/iplan.repository'

interface Request {
  dataPlan: PlanType
}

interface Response {
  planCreated: PlanEntity
}

export class CreatePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute({ dataPlan }: Request): Promise<Response> {
    const planCreated = await this.planRepository.create(dataPlan)
    return { planCreated }
  }
}
