import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ISpecialtyRepository } from '../repositories/interfaces/ispecialty.repository'

interface Request {
  specialty_id: number
}

interface Response {
  removed: boolean
}

export class DeleteSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async execute({ specialty_id }: Request): Promise<Response> {
    const checkSpecialty = await this.specialtyRepository.get(specialty_id)
    if (!checkSpecialty) {
      throw new ResourceNotFoundError()
    }
    await this.specialtyRepository.delete(specialty_id)
    return { removed: true }
  }
}
