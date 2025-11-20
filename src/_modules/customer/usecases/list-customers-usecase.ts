import { CustomerEntity } from '../entities/Customer.entity'
import { ICustomerRepository } from '../repositories/interfaces/icustomer.repository'

interface Request {
  page: number
  name?: string
}

interface Response {
  customers: CustomerEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}
  async execute({ page, name }: Request): Promise<Response> {
    const customers = await this.customerRepository.list(page, name)

    return customers
  }
}
