import { PrismaClient } from '@prisma/client'
import { PrismaProductRepository } from '../../repositories/implementations/prisma-product.repository'
import { CreateProductUseCase } from '../create-product-usecase'
import { DeleteProductUseCase } from '../delete-product-usecase'
import { GetProductUseCase } from '../get-product-usecase'
import { ListProductUseCase } from '../list-products-usecase'
import { ListAllProductUseCase } from '../list-all-products-usecase'
import { UpdateProductUseCase } from '../update-product-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameProductUseCase } from '../find-by-name-product-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const productRepository = new PrismaProductRepository(
  cacheRepository,
  prismaClient,
)
export const ProductUseCaseFactory = {
  createProduct: () => new CreateProductUseCase(productRepository),
  getProduct: () => new GetProductUseCase(productRepository),
  updateProduct: () => new UpdateProductUseCase(productRepository),
  deleteProduct: () => new DeleteProductUseCase(productRepository),
  listProduct: () => new ListProductUseCase(productRepository),
  listAllProduct: () => new ListAllProductUseCase(productRepository),
  findByName: () => new FindByNameProductUseCase(productRepository),
}
