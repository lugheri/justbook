import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ITypeBusinessRepository } from '../repositories/interfaces/itype-business.repository'

interface Request {
  type_business_id: number
}

interface Response {
  removed: boolean
}

export class DeleteTypeBusinessUseCase {
  constructor(private typeBusinessRepository: ITypeBusinessRepository) {}

  async execute({ type_business_id }: Request): Promise<Response> {
    const checkTypeBusiness =
      await this.typeBusinessRepository.get(type_business_id)
    if (!checkTypeBusiness) {
      throw new ResourceNotFoundError()
    }
    await this.typeBusinessRepository.delete(type_business_id)
    return { removed: true }
  }
}
