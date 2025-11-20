import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { CustomerEntity } from '../entities/Customer.entity'
import { ICustomerRepository } from '../repositories/interfaces/icustomer.repository'

interface Request {
  name: string
}

interface Response {
  customer: CustomerEntity
}

export class FindByNameCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const customer = await this.customerRepository.findByName(name)
    if (!customer) {
      throw new ResourceNotFoundError()
    }
    return { customer }
  }
}
