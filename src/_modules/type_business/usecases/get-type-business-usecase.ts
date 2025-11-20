import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { TypeBusinessEntity } from '../entities/TypeBusiness.entity'
import { ITypeBusinessRepository } from '../repositories/interfaces/itype-business.repository'

interface Request {
  type_business_id: number
}

interface Response {
  type_business: TypeBusinessEntity
}

export class GetTypeBusinessUseCase {
  constructor(private typeBusinessRepository: ITypeBusinessRepository) {}
  async execute({ type_business_id }: Request): Promise<Response> {
    const type_business =
      await this.typeBusinessRepository.get(type_business_id)
    if (!type_business) {
      throw new ResourceNotFoundError()
    }
    return { type_business }
  }
}
