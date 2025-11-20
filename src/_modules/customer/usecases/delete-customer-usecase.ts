import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { ICustomerRepository } from '../repositories/interfaces/icustomer.repository'

interface Request {
  customer_id: number
}

interface Response {
  removed: boolean
}

export class DeleteCustomerUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute({ customer_id }: Request): Promise<Response> {
    const checkCustomer = await this.customerRepository.get(customer_id)
    if (!checkCustomer) {
      throw new ResourceNotFoundError()
    }
    await this.customerRepository.delete(customer_id)
    return { removed: true }
  }
}
