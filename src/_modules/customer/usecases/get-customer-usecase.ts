import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { CustomerEntity } from '../entities/Customer.entity'
import { ICustomerRepository } from '../repositories/interfaces/icustomer.repository'

interface Request {
  customer_id: number
}

interface Response {
  customer: CustomerEntity
}

export class GetCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}
  async execute({ customer_id }: Request): Promise<Response> {
    const customer = await this.customerRepository.get(customer_id)
    if (!customer) {
      throw new ResourceNotFoundError()
    }
    return { customer }
  }
}
