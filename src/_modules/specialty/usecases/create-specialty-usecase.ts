import { SpecialtyType } from '../@dtos/SpecialtyDTO'
import { SpecialtyEntity } from '../entities/Specialty.entity'
import { SpecialtyAlreadyExistsError } from '../errors/specialty-already-exists-error'
import { ISpecialtyRepository } from '../repositories/interfaces/ispecialty.repository'

interface Request {
  dataSpecialty: SpecialtyType
}

interface Response {
  specialtyCreated: SpecialtyEntity
}

export class CreateSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}

  async execute({ dataSpecialty }: Request): Promise<Response> {
    const specialtyWithSameName = await this.specialtyRepository.findByName(
      dataSpecialty.name,
    )
    if (specialtyWithSameName) {
      throw new SpecialtyAlreadyExistsError()
    }
    const specialtyCreated =
      await this.specialtyRepository.create(dataSpecialty)
    return { specialtyCreated }
  }
}
