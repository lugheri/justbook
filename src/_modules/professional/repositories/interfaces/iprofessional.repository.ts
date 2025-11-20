import { Prisma } from '@prisma/client'
import { ProfessionalEntity } from '../../entities/Professional.entity'

export interface IProfessionalRepository {
  create(
    data: Prisma.ProfessionalUncheckedCreateInput,
  ): Promise<ProfessionalEntity>
  get(id: number): Promise<ProfessionalEntity | null>
  list(
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    professionals: ProfessionalEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.ProfessionalUncheckedUpdateInput,
  ): Promise<ProfessionalEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number): Promise<ProfessionalEntity[]>
  findByName(name: string): Promise<ProfessionalEntity | null>
}
