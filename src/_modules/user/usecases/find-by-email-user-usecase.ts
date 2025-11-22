import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserEntity } from '../entities/User.entity'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'

interface Request {
  email: string
}

interface Response {
  user: UserEntity
}

export class FindByEmailUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ email }: Request): Promise<Response> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    return { user }
  }
}
