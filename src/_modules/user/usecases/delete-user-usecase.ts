import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'

interface Request {
  user_id: number
}

interface Response {
  removed: boolean
}

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ user_id }: Request): Promise<Response> {
    const checkUser = await this.userRepository.get(user_id)
    if (!checkUser) {
      throw new ResourceNotFoundError()
    }
    await this.userRepository.delete(user_id)
    return { removed: true }
  }
}
