import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { BusinessEntity } from '../entities/Business.entity'
import { IBusinessRepository } from '../repositories/interfaces/ibusiness.repository'

interface Request {
  name: string
}

interface Response {
  business: BusinessEntity
}

export class FindByNameBusinessUseCase {
  constructor(private businessRepository: IBusinessRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const business = await this.businessRepository.findByName(name)
    if (!business) {
      throw new ResourceNotFoundError()
    }
    return { business }
  }
}
