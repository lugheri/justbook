import { PrismaClient } from '@prisma/client'
import { PrismaBusinessRepository } from '../../repositories/implementations/prisma-business.repository'
import { CreateBusinessUseCase } from '../create-business-usecase'
import { DeleteBusinessUseCase } from '../delete-business-usecase'
import { GetBusinessUseCase } from '../get-business-usecase'
import { ListBusinessUseCase } from '../list-business-usecase'
import { ListAllBusinessUseCase } from '../list-all-business-usecase'
import { UpdateBusinessUseCase } from '../update-business-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameBusinessUseCase } from '../find-by-name-business-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const businessRepository = new PrismaBusinessRepository(
  cacheRepository,
  prismaClient,
)
export const BusinessUseCaseFactory = {
  createBusiness: () => new CreateBusinessUseCase(businessRepository),
  getBusiness: () => new GetBusinessUseCase(businessRepository),
  updateBusiness: () => new UpdateBusinessUseCase(businessRepository),
  deleteBusiness: () => new DeleteBusinessUseCase(businessRepository),
  listBusiness: () => new ListBusinessUseCase(businessRepository),
  listAllBusiness: () => new ListAllBusinessUseCase(businessRepository),
  findByName: () => new FindByNameBusinessUseCase(businessRepository),
}
