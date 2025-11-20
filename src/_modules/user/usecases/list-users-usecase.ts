import { UserEntity } from '../entities/User.entity'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'

interface Request {
  page: number
  active: number
  email?: string
  name?: string
}

interface Response {
  users: UserEntity[]
  meta: {
    page: number
    perPage: number
    totalCount: number
  }
}

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ page, active, email, name }: Request): Promise<Response> {
    const user = await this.userRepository.list(page, active, email, name)

    return user
  }
}
