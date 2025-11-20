import { TypeBusinessPartialType } from '../@dtos/TypeBusinessDTO'
import { TypeBusinessEntity } from '../entities/TypeBusiness.entity'
import { ITypeBusinessRepository } from '../repositories/interfaces/itype-business.repository'

interface Request {
  type_business_id: number
  type_business_data: TypeBusinessPartialType
}
interface Response {
  typeBusinessUpdated: TypeBusinessEntity
}

export class UpdateTypeBusinessUseCase {
  constructor(private typeBusinessRepository: ITypeBusinessRepository) {}
  async execute({
    type_business_id,
    type_business_data,
  }: Request): Promise<Response> {
    const typeBusinessUpdated = await this.typeBusinessRepository.update(
      type_business_id,
      type_business_data,
    )
    return { typeBusinessUpdated }
  }
}
