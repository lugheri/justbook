import { Prisma } from '@prisma/client'
import { CustomerEntity } from '../../entities/Customer.entity'

export interface ICustomerRepository {
  create(data: Prisma.CustomerUncheckedCreateInput): Promise<CustomerEntity>
  get(id: number): Promise<CustomerEntity | null>
  list(
    page: number,
    name?: string,
  ): Promise<{
    customers: CustomerEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.CustomerUncheckedUpdateInput,
  ): Promise<CustomerEntity>
  delete(id: number): Promise<boolean>

  listAll(): Promise<CustomerEntity[]>
  findByName(name: string): Promise<CustomerEntity | null>
}
