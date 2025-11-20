import { ProductEntity } from '../entities/Product.entity'
import { IProductRepository } from '../repositories/interfaces/iproduct.repository'

interface Request {
  page: number
  active: number
  name?: string
}

interface Response {
  products: ProductEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListProductUseCase {
  constructor(private productRepository: IProductRepository) {}
  async execute({ page, active, name }: Request): Promise<Response> {
    const products = await this.productRepository.list(page, active, name)

    return products
  }
}
