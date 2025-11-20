import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { UserEntity } from '../entities/User.entity'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'

interface Request {
  user_id: number
}

interface Response {
  user: UserEntity
}

export class GetUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ user_id }: Request): Promise<Response> {
    const user = await this.userRepository.get(user_id)
    if (!user) {
      throw new ResourceNotFoundError()
    }
    return { user }
  }
}
