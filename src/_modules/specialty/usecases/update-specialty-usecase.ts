import { SpecialtyPartialType } from '../@dtos/SpecialtyDTO'
import { SpecialtyEntity } from '../entities/Specialty.entity'
import { ISpecialtyRepository } from '../repositories/interfaces/ispecialty.repository'

interface Request {
  specialty_id: number
  specialty_data: SpecialtyPartialType
}
interface Response {
  specialtyUpdated: SpecialtyEntity
}

export class UpdateSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}
  async execute({ specialty_id, specialty_data }: Request): Promise<Response> {
    const specialtyUpdated = await this.specialtyRepository.update(
      specialty_id,
      specialty_data,
    )
    return { specialtyUpdated }
  }
}
