import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IProfessionalRepository } from '../repositories/interfaces/iprofessional.repository'

interface Request {
  professional_id: number
}

interface Response {
  removed: boolean
}

export class DeleteProfessionalUseCase {
  constructor(private professionalRepository: IProfessionalRepository) {}

  async execute({ professional_id }: Request): Promise<Response> {
    const checkProfessional =
      await this.professionalRepository.get(professional_id)
    if (!checkProfessional) {
      throw new ResourceNotFoundError()
    }
    await this.professionalRepository.delete(professional_id)
    return { removed: true }
  }
}
