import { CustomerType } from '../@dtos/CustomerDTO'
import { CustomerEntity } from '../entities/Customer.entity'
import { CustomerAlreadyExistsError } from '../errors/customer-already-exists-error'
import { ICustomerRepository } from '../repositories/interfaces/icustomer.repository'

interface Request {
  dataCustomer: CustomerType
}

interface Response {
  customerCreated: CustomerEntity
}

export class CreateCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute({ dataCustomer }: Request): Promise<Response> {
    const customerWithSameName = await this.customerRepository.findByName(
      dataCustomer.name,
    )
    if (customerWithSameName) {
      throw new CustomerAlreadyExistsError()
    }
    const customerCreated = await this.customerRepository.create(dataCustomer)
    return { customerCreated }
  }
}
