import { PrismaClient } from '@prisma/client'
import { PrismaUserRepository } from '../../repositories/implementations/prisma-user.repository'
import { CreateUserUseCase } from '../create-user-usecase'
import { DeleteUserUseCase } from '../delete-user-usecase'
import { GetUserUseCase } from '../get-user-usecase'
import { ListUsersUseCase } from '../list-users-usecase'
import { ListAllUsersUseCase } from '../list-all-user-usecase'
import { UpdateUserUseCase } from '../update-user-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameUserUseCase } from '../find-by-name-user-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const userRepository = new PrismaUserRepository(cacheRepository, prismaClient)
export const UserUseCaseFactory = {
  createUser: () => new CreateUserUseCase(userRepository),
  getUser: () => new GetUserUseCase(userRepository),
  updateUser: () => new UpdateUserUseCase(userRepository),
  deleteUser: () => new DeleteUserUseCase(userRepository),
  listUsers: () => new ListUsersUseCase(userRepository),
  listAllUsers: () => new ListAllUsersUseCase(userRepository),
  findByName: () => new FindByNameUserUseCase(userRepository),
}
