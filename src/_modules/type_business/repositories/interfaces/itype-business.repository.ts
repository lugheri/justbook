import { Prisma } from '@prisma/client'
import { TypeBusinessEntity } from '../../entities/TypeBusiness.entity'

export interface ITypeBusinessRepository {
  create(
    data: Prisma.TypeBusinessUncheckedCreateInput,
  ): Promise<TypeBusinessEntity>
  get(id: number): Promise<TypeBusinessEntity | null>
  list(
    page: number,
    name?: string,
  ): Promise<{
    type_business: TypeBusinessEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.TypeBusinessUncheckedUpdateInput,
  ): Promise<TypeBusinessEntity>
  delete(id: number): Promise<boolean>

  listAll(): Promise<TypeBusinessEntity[]>
  findByName(name: string): Promise<TypeBusinessEntity | null>
}
