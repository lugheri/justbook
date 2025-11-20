import { Prisma } from '@prisma/client'
import { BusinessEntity } from '../../entities/Business.entity'

export interface IBusinessRepository {
  create(data: Prisma.BusinessUncheckedCreateInput): Promise<BusinessEntity>
  get(id: number): Promise<BusinessEntity | null>
  list(
    page: number,
    active: number,
    agreed: number,
    name?: string,
  ): Promise<{
    business: BusinessEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.BusinessUncheckedUpdateInput,
  ): Promise<BusinessEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number, agreed: number): Promise<BusinessEntity[]>
  findByName(name: string): Promise<BusinessEntity | null>
}
