import { UserEntity } from '../entities/User.entity'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'

interface Request {
  active: number
}

interface Response {
  users: UserEntity[]
}

export class ListAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ active }: Request): Promise<Response> {
    const users = await this.userRepository.listAll(active)

    return { users }
  }
}
