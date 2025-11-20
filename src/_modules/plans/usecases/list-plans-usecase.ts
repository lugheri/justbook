import { PlanEntity } from '../entities/Plans.entity'
import { IPlanRepository } from '../repositories/interfaces/iplan.repository'

interface Request {
  page: number
  status: 'active' | 'expired' | 'all'
  vigency: 'monthly' | 'annual' | 'all'
  name?: string
}

interface Response {
  plans: PlanEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListPlansUseCase {
  constructor(private planRepository: IPlanRepository) {}
  async execute({ page, status, vigency, name }: Request): Promise<Response> {
    const plan = await this.planRepository.list(page, status, vigency, name)

    return plan
  }
}
