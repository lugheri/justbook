import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IBusinessRepository } from '../repositories/interfaces/ibusiness.repository'

interface Request {
  business_id: number
}

interface Response {
  removed: boolean
}

export class DeleteBusinessUseCase {
  constructor(private businessRepository: IBusinessRepository) {}

  async execute({ business_id }: Request): Promise<Response> {
    const checkBusiness = await this.businessRepository.get(business_id)
    if (!checkBusiness) {
      throw new ResourceNotFoundError()
    }
    await this.businessRepository.delete(business_id)
    return { removed: true }
  }
}
