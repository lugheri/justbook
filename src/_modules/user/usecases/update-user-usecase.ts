import { UserPartialType } from '../@dtos/UserDTO'
import { UserEntity } from '../entities/User.entity'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'
import { hash } from 'bcryptjs'
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
    let user = user_data
    if (user_data.password) {
      const newPassword = await hash(user_data.password, 6)

      user = {
        ...user_data,
        password: newPassword,
      }
    }

    const userUpdated = await this.userRepository.update(user_id, user)
    return { userUpdated }
  }
}
