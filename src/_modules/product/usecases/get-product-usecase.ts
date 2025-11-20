import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ProductEntity } from '../entities/Product.entity'
import { IProductRepository } from '../repositories/interfaces/iproduct.repository'

interface Request {
  product_id: number
}

interface Response {
  product: ProductEntity
}

export class GetProductUseCase {
  constructor(private productRepository: IProductRepository) {}
  async execute({ product_id }: Request): Promise<Response> {
    const product = await this.productRepository.get(product_id)
    if (!product) {
      throw new ResourceNotFoundError()
    }
    return { product }
  }
}
