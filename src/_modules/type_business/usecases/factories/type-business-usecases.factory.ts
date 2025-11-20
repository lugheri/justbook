import { PrismaClient } from '@prisma/client'
import { PrismaTypeBusinessRepository } from '../../repositories/implementations/prisma-type-business.repository'
import { CreateTypeBusinessUseCase } from '../create-type-business-usecase'
import { DeleteTypeBusinessUseCase } from '../delete-type-business-usecase'
import { GetTypeBusinessUseCase } from '../get-type-business-usecase'
import { ListTypeBusinessUseCase } from '../list-type-business-usecase'
import { ListAllTypeBusinessUseCase } from '../list-all-type-business-usecase'
import { UpdateTypeBusinessUseCase } from '../update-type-business-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameTypeBusinessUseCase } from '../find-by-name-type-business-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const typeBusinessRepository = new PrismaTypeBusinessRepository(
  cacheRepository,
  prismaClient,
)
export const TypeBusinessUseCaseFactory = {
  createTypeBusiness: () =>
    new CreateTypeBusinessUseCase(typeBusinessRepository),
  getTypeBusiness: () => new GetTypeBusinessUseCase(typeBusinessRepository),
  updateTypeBusiness: () =>
    new UpdateTypeBusinessUseCase(typeBusinessRepository),
  deleteTypeBusiness: () =>
    new DeleteTypeBusinessUseCase(typeBusinessRepository),
  listTypeBusiness: () => new ListTypeBusinessUseCase(typeBusinessRepository),
  listAllTypeBusiness: () =>
    new ListAllTypeBusinessUseCase(typeBusinessRepository),
  findByName: () => new FindByNameTypeBusinessUseCase(typeBusinessRepository),
}
