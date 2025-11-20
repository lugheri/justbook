import { PrismaClient } from '@prisma/client'
import { PrismaProfessionalRepository } from '../../repositories/implementations/prisma-professional.repository'
import { CreateProfessionalUseCase } from '../create-profissional-usecase'
import { DeleteProfessionalUseCase } from '../delete-profissional-usecase'
import { GetProfessionalUseCase } from '../get-profissional-usecase'
import { ListProfessionalUseCase } from '../list-profissionals-usecase'
import { ListAllProfessionalUseCase } from '../list-all-profissionals-usecase'
import { UpdateProfessionalUseCase } from '../update-profissional-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameProfessionalUseCase } from '../find-by-name-profissional-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const professionalRepository = new PrismaProfessionalRepository(
  cacheRepository,
  prismaClient,
)
export const ProfessionalUseCaseFactory = {
  createProfessional: () =>
    new CreateProfessionalUseCase(professionalRepository),
  getProfessional: () => new GetProfessionalUseCase(professionalRepository),
  updateProfessional: () =>
    new UpdateProfessionalUseCase(professionalRepository),
  deleteProfessional: () =>
    new DeleteProfessionalUseCase(professionalRepository),
  listProfessional: () => new ListProfessionalUseCase(professionalRepository),
  listAllProfessional: () =>
    new ListAllProfessionalUseCase(professionalRepository),
  findByName: () => new FindByNameProfessionalUseCase(professionalRepository),
}
