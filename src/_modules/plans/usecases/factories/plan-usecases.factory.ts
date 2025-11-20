import { PrismaClient } from '@prisma/client'
import { PrismaPlanRepository } from '../../repositories/implementations/prisma-plan.repository'
import { CreatePlanUseCase } from '../create-plan-usecase'
import { DeletePlanUseCase } from '../delete-plan-usecase'
import { GetPlanUseCase } from '../get-plan-usecase'
import { ListPlansUseCase } from '../list-plans-usecase'
import { ListAllPlansUseCase } from '../list-all-plans-usecase'
import { UpdatePlanUseCase } from '../update-plans-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNamePlanUseCase } from '../find-by-name-plan-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const planRepository = new PrismaPlanRepository(cacheRepository, prismaClient)
export const PlanUseCaseFactory = {
  createPlan: () => new CreatePlanUseCase(planRepository),
  getPlan: () => new GetPlanUseCase(planRepository),
  updatePlan: () => new UpdatePlanUseCase(planRepository),
  deletePlan: () => new DeletePlanUseCase(planRepository),
  listPlans: () => new ListPlansUseCase(planRepository),
  listAllPlans: () => new ListAllPlansUseCase(planRepository),
  findByName: () => new FindByNamePlanUseCase(planRepository),
}
