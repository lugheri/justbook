import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IPlanRepository } from '../repositories/interfaces/iplan.repository'

interface Request {
  plan_id: number
}

interface Response {
  removed: boolean
}

export class DeletePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute({ plan_id }: Request): Promise<Response> {
    const checkPlan = await this.planRepository.get(plan_id)
    if (!checkPlan) {
      throw new ResourceNotFoundError()
    }
    await this.planRepository.delete(plan_id)
    return { removed: true }
  }
}
