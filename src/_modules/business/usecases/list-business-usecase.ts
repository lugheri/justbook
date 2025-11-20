import { BusinessEntity } from '../entities/Business.entity'
import { IBusinessRepository } from '../repositories/interfaces/ibusiness.repository'

interface Request {
  page: number
  active: number
  agreed: number
  name?: string
}

interface Response {
  business: BusinessEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListBusinessUseCase {
  constructor(private businessRepository: IBusinessRepository) {}
  async execute({ page, active, agreed, name }: Request): Promise<Response> {
    const business = await this.businessRepository.list(
      page,
      active,
      agreed,
      name,
    )

    return business
  }
}
