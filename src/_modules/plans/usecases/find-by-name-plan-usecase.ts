import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { PlanEntity } from '../entities/Plans.entity'
import { IPlanRepository } from '../repositories/interfaces/iplan.repository'

interface Request {
  name: string
}

interface Response {
  plan: PlanEntity
}

export class FindByNamePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const plan = await this.planRepository.findByName(name)
    if (!plan) {
      throw new ResourceNotFoundError()
    }
    return { plan }
  }
}
