import { Prisma } from '@prisma/client'
import { ProductEntity } from '../../entities/Product.entity'

export interface IProductRepository {
  create(data: Prisma.ProductUncheckedCreateInput): Promise<ProductEntity>
  get(id: number): Promise<ProductEntity | null>
  list(
    page: number,
    active: number,
    name?: string,
  ): Promise<{
    products: ProductEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(
    id: number,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<ProductEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number): Promise<ProductEntity[]>
  findByName(name: string): Promise<ProductEntity | null>
}
