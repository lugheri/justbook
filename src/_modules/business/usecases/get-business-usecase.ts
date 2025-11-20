import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { BusinessEntity } from '../entities/Business.entity'
import { IBusinessRepository } from '../repositories/interfaces/ibusiness.repository'

interface Request {
  business_id: number
}

interface Response {
  business: BusinessEntity
}

export class GetBusinessUseCase {
  constructor(private businessRepository: IBusinessRepository) {}
  async execute({ business_id }: Request): Promise<Response> {
    const business = await this.businessRepository.get(business_id)
    if (!business) {
      throw new ResourceNotFoundError()
    }
    return { business }
  }
}
