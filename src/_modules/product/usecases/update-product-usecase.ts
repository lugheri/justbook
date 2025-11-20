import { ProductPartialType } from '../@dtos/ProductDTO'
import { ProductEntity } from '../entities/Product.entity'
import { IProductRepository } from '../repositories/interfaces/iproduct.repository'

interface Request {
  product_id: number
  product_data: ProductPartialType
}
interface Response {
  productUpdated: ProductEntity
}

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}
  async execute({ product_id, product_data }: Request): Promise<Response> {
    const productUpdated = await this.productRepository.update(
      product_id,
      product_data,
    )
    return { productUpdated }
  }
}
