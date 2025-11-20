import { ProductType } from '../@dtos/ProductDTO'
import { ProductEntity } from '../entities/Product.entity'
import { ProductAlreadyExistsError } from '../errors/product-already-exists-error'
import { IProductRepository } from '../repositories/interfaces/iproduct.repository'

interface Request {
  dataProduct: ProductType
}

interface Response {
  productCreated: ProductEntity
}

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ dataProduct }: Request): Promise<Response> {
    const productWithSameName = await this.productRepository.findByName(
      dataProduct.name,
    )
    if (productWithSameName) {
      throw new ProductAlreadyExistsError()
    }
    const productCreated = await this.productRepository.create(dataProduct)
    return { productCreated }
  }
}
