import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ProfessionalEntity } from '../entities/Professional.entity'
import { IProfessionalRepository } from '../repositories/interfaces/iprofessional.repository'

interface Request {
  professional_id: number
}

interface Response {
  professional: ProfessionalEntity
}

export class GetProfessionalUseCase {
  constructor(private professionalRepository: IProfessionalRepository) {}
  async execute({ professional_id }: Request): Promise<Response> {
    const professional = await this.professionalRepository.get(professional_id)
    if (!professional) {
      throw new ResourceNotFoundError()
    }
    return { professional }
  }
}
