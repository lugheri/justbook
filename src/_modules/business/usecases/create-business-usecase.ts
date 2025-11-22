import { BusinessType } from '../@dtos/BusinessDTO'
import { BusinessEntity } from '../entities/Business.entity'
import { IBusinessRepository } from '../repositories/interfaces/ibusiness.repository'

interface Request {
  dataBusiness: BusinessType
}

interface Response {
  businessCreated: BusinessEntity
}

export class CreateBusinessUseCase {
  constructor(private businessRepository: IBusinessRepository) {}

  async execute({ dataBusiness }: Request): Promise<Response> {
    const businessCreated = await this.businessRepository.create(dataBusiness)
    return { businessCreated }
  }
}
