import { CustomerEntity } from '../entities/Customer.entity'
import { ICustomerRepository } from '../repositories/interfaces/icustomer.repository'

interface Response {
  customers: CustomerEntity[]
}

export class ListAllCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}
  async execute(): Promise<Response> {
    const customers = await this.customerRepository.listAll()

    return { customers }
  }
}
