import { TypeBusinessEntity } from '../entities/TypeBusiness.entity'
import { ITypeBusinessRepository } from '../repositories/interfaces/itype-business.repository'

interface Response {
  type_business: TypeBusinessEntity[]
}

export class ListAllTypeBusinessUseCase {
  constructor(private typeBusinessRepository: ITypeBusinessRepository) {}
  async execute(): Promise<Response> {
    const type_business = await this.typeBusinessRepository.listAll()

    return { type_business }
  }
}
