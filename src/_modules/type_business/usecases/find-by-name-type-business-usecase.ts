import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { TypeBusinessEntity } from '../entities/TypeBusiness.entity'
import { ITypeBusinessRepository } from '../repositories/interfaces/itype-business.repository'

interface Request {
  name: string
}

interface Response {
  type_business: TypeBusinessEntity
}

export class FindByNameTypeBusinessUseCase {
  constructor(private typeBusinessRepository: ITypeBusinessRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const type_business = await this.typeBusinessRepository.findByName(name)
    if (!type_business) {
      throw new ResourceNotFoundError()
    }
    return { type_business }
  }
}
