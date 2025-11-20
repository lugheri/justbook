import { ProductEntity } from '../entities/Product.entity'
import { IProductRepository } from '../repositories/interfaces/iproduct.repository'

interface Request {
  active: number
}

interface Response {
  products: ProductEntity[]
}

export class ListAllProductUseCase {
  constructor(private productRepository: IProductRepository) {}
  async execute({ active }: Request): Promise<Response> {
    const products = await this.productRepository.listAll(active)

    return { products }
  }
}
