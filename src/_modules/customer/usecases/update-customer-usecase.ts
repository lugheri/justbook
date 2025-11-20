import { CustomerPartialType } from '../@dtos/CustomerDTO'
import { CustomerEntity } from '../entities/Customer.entity'
import { ICustomerRepository } from '../repositories/interfaces/icustomer.repository'

interface Request {
  customer_id: number
  customer_data: CustomerPartialType
}
interface Response {
  customerUpdated: CustomerEntity
}

export class UpdateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}
  async execute({ customer_id, customer_data }: Request): Promise<Response> {
    const customerUpdated = await this.customerRepository.update(
      customer_id,
      customer_data,
    )
    return { customerUpdated }
  }
}
