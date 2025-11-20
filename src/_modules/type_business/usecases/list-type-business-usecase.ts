import { TypeBusinessEntity } from '../entities/TypeBusiness.entity'
import { ITypeBusinessRepository } from '../repositories/interfaces/itype-business.repository'

interface Request {
  page: number
  name?: string
}

interface Response {
  type_business: TypeBusinessEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListTypeBusinessUseCase {
  constructor(private typeBusinessRepository: ITypeBusinessRepository) {}
  async execute({ page, name }: Request): Promise<Response> {
    const type_business = await this.typeBusinessRepository.list(page, name)

    return type_business
  }
}
