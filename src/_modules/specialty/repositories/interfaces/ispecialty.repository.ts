import { Prisma } from '@prisma/client'
import { SpecialtyEntity } from '../../entities/Specialty.entity'

export interface ISpecialtyRepository {
  create(data: Prisma.SpecialtyUncheckedCreateInput): Promise<SpecialtyEntity>
  get(id: number): Promise<SpecialtyEntity | null>
  list(
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    specialties: SpecialtyEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.SpecialtyUncheckedUpdateInput,
  ): Promise<SpecialtyEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number): Promise<SpecialtyEntity[]>
  findByName(name: string): Promise<SpecialtyEntity | null>
}
