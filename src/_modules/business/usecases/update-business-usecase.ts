import { BusinessPartialType } from '../@dtos/BusinessDTO'
import { BusinessEntity } from '../entities/Business.entity'
import { IBusinessRepository } from '../repositories/interfaces/ibusiness.repository'

interface Request {
  business_id: number
  business_data: BusinessPartialType
}
interface Response {
  businessUpdated: BusinessEntity
}

export class UpdateBusinessUseCase {
  constructor(private businessRepository: IBusinessRepository) {}
  async execute({ business_id, business_data }: Request): Promise<Response> {
    const businessUpdated = await this.businessRepository.update(
      business_id,
      business_data,
    )
    return { businessUpdated }
  }
}
