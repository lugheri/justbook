import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ProductEntity } from '../entities/Product.entity'
import { IProductRepository } from '../repositories/interfaces/iproduct.repository'

interface Request {
  name: string
}

interface Response {
  product: ProductEntity
}

export class FindByNameProductUseCase {
  constructor(private productRepository: IProductRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const product = await this.productRepository.findByName(name)
    if (!product) {
      throw new ResourceNotFoundError()
    }
    return { product }
  }
}
