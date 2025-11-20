import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ProfessionalEntity } from '../entities/Professional.entity'
import { IProfessionalRepository } from '../repositories/interfaces/iprofessional.repository'

interface Request {
  name: string
}

interface Response {
  professional: ProfessionalEntity
}

export class FindByNameProfessionalUseCase {
  constructor(private professionalRepository: IProfessionalRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const professional = await this.professionalRepository.findByName(name)
    if (!professional) {
      throw new ResourceNotFoundError()
    }
    return { professional }
  }
}
