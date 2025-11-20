import { ProfessionalPartialType } from '../@dtos/ProfessionalDTO'
import { ProfessionalEntity } from '../entities/Professional.entity'
import { IProfessionalRepository } from '../repositories/interfaces/iprofessional.repository'

interface Request {
  professional_id: number
  professional_data: ProfessionalPartialType
}
interface Response {
  professionalUpdated: ProfessionalEntity
}

export class UpdateProfessionalUseCase {
  constructor(private professionalRepository: IProfessionalRepository) {}
  async execute({
    professional_id,
    professional_data,
  }: Request): Promise<Response> {
    const professionalUpdated = await this.professionalRepository.update(
      professional_id,
      professional_data,
    )
    return { professionalUpdated }
  }
}
