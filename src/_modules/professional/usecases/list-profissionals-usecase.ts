import { ProfessionalEntity } from '../entities/Professional.entity'
import { IProfessionalRepository } from '../repositories/interfaces/iprofessional.repository'

interface Request {
  page: number
  active: number
  name?: string
}

interface Response {
  professionals: ProfessionalEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListProfessionalUseCase {
  constructor(private professionalRepository: IProfessionalRepository) {}
  async execute({ page, active, name }: Request): Promise<Response> {
    const professionals = await this.professionalRepository.list(
      page,
      active,
      name,
    )

    return professionals
  }
}
