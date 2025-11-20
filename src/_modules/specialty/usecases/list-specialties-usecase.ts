import { SpecialtyEntity } from '../entities/Specialty.entity'
import { ISpecialtyRepository } from '../repositories/interfaces/ispecialty.repository'

interface Request {
  page: number
  active: number
  name?: string
}

interface Response {
  specialties: SpecialtyEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}
  async execute({ page, active, name }: Request): Promise<Response> {
    const specialties = await this.specialtyRepository.list(page, active, name)

    return specialties
  }
}
