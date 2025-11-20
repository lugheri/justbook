import { TypeBusinessType } from '../@dtos/TypeBusinessDTO'
import { TypeBusinessEntity } from '../entities/TypeBusiness.entity'
import { TypeBusinessAlreadyExistsError } from '../errors/type-business-already-exists-error'
import { ITypeBusinessRepository } from '../repositories/interfaces/itype-business.repository'

interface Request {
  dataTypeBusiness: TypeBusinessType
}

interface Response {
  typeBusinessCreated: TypeBusinessEntity
}

export class CreateTypeBusinessUseCase {
  constructor(private typeBusinessRepository: ITypeBusinessRepository) {}

  async execute({ dataTypeBusiness }: Request): Promise<Response> {
    const typeBusinessWithSameName =
      await this.typeBusinessRepository.findByName(dataTypeBusiness.name)
    if (typeBusinessWithSameName) {
      throw new TypeBusinessAlreadyExistsError()
    }
    const typeBusinessCreated =
      await this.typeBusinessRepository.create(dataTypeBusiness)
    return { typeBusinessCreated }
  }
}
