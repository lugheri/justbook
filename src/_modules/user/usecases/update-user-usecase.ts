import { UserPartialType } from '../@dtos/UserDTO'
import { UserEntity } from '../entities/User.entity'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'

interface Request {
  user_id: number
  user_data: UserPartialType
}
interface Response {
  userUpdated: UserEntity
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ user_id, user_data }: Request): Promise<Response> {
    const userUpdated = await this.userRepository.update(user_id, user_data)
    return { userUpdated }
  }
}
