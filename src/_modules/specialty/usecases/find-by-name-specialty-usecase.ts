import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { SpecialtyEntity } from '../entities/Specialty.entity'
import { ISpecialtyRepository } from '../repositories/interfaces/ispecialty.repository'

interface Request {
  name: string
}

interface Response {
  specialty: SpecialtyEntity
}

export class FindByNameSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const specialty = await this.specialtyRepository.findByName(name)
    if (!specialty) {
      throw new ResourceNotFoundError()
    }
    return { specialty }
  }
}
