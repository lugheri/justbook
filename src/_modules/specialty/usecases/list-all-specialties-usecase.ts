import { SpecialtyEntity } from '../entities/Specialty.entity'
import { ISpecialtyRepository } from '../repositories/interfaces/ispecialty.repository'

interface Request {
  active: number
}

interface Response {
  specialties: SpecialtyEntity[]
}

export class ListAllSpecialtyUseCase {
  constructor(private specialtyRepository: ISpecialtyRepository) {}
  async execute({ active }: Request): Promise<Response> {
    const specialties = await this.specialtyRepository.listAll(active)

    return { specialties }
  }
}
