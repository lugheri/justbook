import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IProductRepository } from '../repositories/interfaces/iproduct.repository'

interface Request {
  product_id: number
}

interface Response {
  removed: boolean
}

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute({ product_id }: Request): Promise<Response> {
    const checkProduct = await this.productRepository.get(product_id)
    if (!checkProduct) {
      throw new ResourceNotFoundError()
    }
    await this.productRepository.delete(product_id)
    return { removed: true }
  }
}
