import { ProfessionalType } from '../@dtos/ProfessionalDTO'
import { ProfessionalEntity } from '../entities/Professional.entity'
import { ProfessionalAlreadyExistsError } from '../errors/professional-already-exists-error'
import { IProfessionalRepository } from '../repositories/interfaces/iprofessional.repository'

interface Request {
  dataProfessional: ProfessionalType
}

interface Response {
  professionalCreated: ProfessionalEntity
}

export class CreateProfessionalUseCase {
  constructor(private professionalRepository: IProfessionalRepository) {}

  async execute({ dataProfessional }: Request): Promise<Response> {
    const professionalWithSameName =
      await this.professionalRepository.findByName(dataProfessional.name)
    if (professionalWithSameName) {
      throw new ProfessionalAlreadyExistsError()
    }
    const professionalCreated =
      await this.professionalRepository.create(dataProfessional)
    return { professionalCreated }
  }
}
