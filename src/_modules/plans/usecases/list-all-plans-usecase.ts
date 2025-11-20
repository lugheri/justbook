import { PlanEntity } from '../entities/Plans.entity'
import { IPlanRepository } from '../repositories/interfaces/iplan.repository'

interface Request {
  active: number
}

interface Response {
  plans: PlanEntity[]
}

export class ListAllPlansUseCase {
  constructor(private planRepository: IPlanRepository) {}
  async execute({ active }: Request): Promise<Response> {
    const plans = await this.planRepository.listAll(active)

    return { plans }
  }
}
