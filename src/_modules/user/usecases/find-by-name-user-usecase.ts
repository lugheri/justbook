import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserEntity } from '../entities/User.entity'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'

interface Request {
  name: string
}

interface Response {
  user: UserEntity
}

export class FindByNameUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ name }: Request): Promise<Response> {
    const user = await this.userRepository.findByName(name)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    return { user }
  }
}
