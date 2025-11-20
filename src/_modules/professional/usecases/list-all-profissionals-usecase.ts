import { ProfessionalEntity } from '../entities/Professional.entity'
import { IProfessionalRepository } from '../repositories/interfaces/iprofessional.repository'

interface Request {
  active: number
}

interface Response {
  professionals: ProfessionalEntity[]
}

export class ListAllProfessionalUseCase {
  constructor(private professionalRepository: IProfessionalRepository) {}
  async execute({ active }: Request): Promise<Response> {
    const professionals = await this.professionalRepository.listAll(active)

    return { professionals }
  }
}
