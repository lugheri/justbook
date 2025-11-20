import { PrismaClient } from '@prisma/client'
import { PrismaSpecialtyRepository } from '../../repositories/implementations/prisma-specialty.repository'
import { CreateSpecialtyUseCase } from '../create-specialty-usecase'
import { DeleteSpecialtyUseCase } from '../delete-specialty-usecase'
import { GetSpecialtyUseCase } from '../get-specialty-usecase'
import { ListSpecialtyUseCase } from '../list-specialties-usecase'
import { ListAllSpecialtyUseCase } from '../list-all-specialties-usecase'
import { UpdateSpecialtyUseCase } from '../update-specialty-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameSpecialtyUseCase } from '../find-by-name-specialty-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const specialtyRepository = new PrismaSpecialtyRepository(
  cacheRepository,
  prismaClient,
)
export const SpecialtyUseCaseFactory = {
  createSpecialty: () => new CreateSpecialtyUseCase(specialtyRepository),
  getSpecialty: () => new GetSpecialtyUseCase(specialtyRepository),
  updateSpecialty: () => new UpdateSpecialtyUseCase(specialtyRepository),
  deleteSpecialty: () => new DeleteSpecialtyUseCase(specialtyRepository),
  listSpecialty: () => new ListSpecialtyUseCase(specialtyRepository),
  listAllSpecialty: () => new ListAllSpecialtyUseCase(specialtyRepository),
  findByName: () => new FindByNameSpecialtyUseCase(specialtyRepository),
}
