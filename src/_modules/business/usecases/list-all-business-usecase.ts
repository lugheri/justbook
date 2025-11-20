import { BusinessEntity } from '../entities/Business.entity'
import { IBusinessRepository } from '../repositories/interfaces/ibusiness.repository'

interface Request {
  active: number
  agreed: number
}

interface Response {
  business: BusinessEntity[]
}

export class ListAllBusinessUseCase {
  constructor(private businessRepository: IBusinessRepository) {}
  async execute({ active, agreed }: Request): Promise<Response> {
    const business = await this.businessRepository.listAll(active, agreed)

    return { business }
  }
}
