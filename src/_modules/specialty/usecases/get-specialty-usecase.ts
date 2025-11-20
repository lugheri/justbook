import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { SpecialtyEntity } from '../entities/Specialty.entity'
import { ISpecialtyRepository } from '../repositories/interfaces/ispecialty.repository'

interface Request {
  specialty_id: number
}

interface Response {
  specialty: SpecialtyEntity
}

export class GetSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}
  async execute({ specialty_id }: Request): Promise<Response> {
    const specialty = await this.specialtyRepository.get(specialty_id)
    if (!specialty) {
      throw new ResourceNotFoundError()
    }
    return { specialty }
  }
}
