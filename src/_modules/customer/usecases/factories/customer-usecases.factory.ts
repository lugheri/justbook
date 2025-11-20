import { PrismaClient } from '@prisma/client'
import { PrismaCustomerRepository } from '../../repositories/implementations/prisma-customer.repository'
import { CreateCustomerUseCase } from '../create-customer-usecase'
import { DeleteCustomerUseCase } from '../delete-customer-usecase'
import { GetCustomerUseCase } from '../get-customer-usecase'
import { ListCustomerUseCase } from '../list-customers-usecase'
import { ListAllCustomerUseCase } from '../list-all-customers-usecase'
import { UpdateCustomerUseCase } from '../update-customer-usecase'
import { RedisCacheRepository } from '@/infra/cache/redis-cache-repository'
import { FindByNameCustomerUseCase } from '../find-by-name-customer-usecase'

const cacheRepository = new RedisCacheRepository()
const prismaClient = new PrismaClient()
const customerRepository = new PrismaCustomerRepository(
  cacheRepository,
  prismaClient,
)
export const CustomerUseCaseFactory = {
  createCustomer: () => new CreateCustomerUseCase(customerRepository),
  getCustomer: () => new GetCustomerUseCase(customerRepository),
  updateCustomer: () => new UpdateCustomerUseCase(customerRepository),
  deleteCustomer: () => new DeleteCustomerUseCase(customerRepository),
  listCustomer: () => new ListCustomerUseCase(customerRepository),
  listAllCustomer: () => new ListAllCustomerUseCase(customerRepository),
  findByName: () => new FindByNameCustomerUseCase(customerRepository),
}
