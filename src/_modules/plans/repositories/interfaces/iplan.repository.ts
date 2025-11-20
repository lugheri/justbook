import { Prisma } from '@prisma/client'
import { PlanEntity } from '../../entities/Plans.entity'

export interface IPlanRepository {
  create(data: Prisma.PlanUncheckedCreateInput): Promise<PlanEntity>
  get(id: number): Promise<PlanEntity | null>
  list(
    page: number,
    status: 'active' | 'expired' | 'all',
    vigency: 'monthly' | 'annual' | 'all',
    name?: string,
  ): Promise<{
    plans: PlanEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(id: number, data: Prisma.PlanUncheckedUpdateInput): Promise<PlanEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number): Promise<PlanEntity[]>
  findByName(name: string): Promise<PlanEntity | null>
}
