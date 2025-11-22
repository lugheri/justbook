import { UserType } from '../@dtos/UserDTO'
import { UserEntity } from '../entities/User.entity'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { IUserRepository } from '../repositories/interfaces/iuser.repository'
import { hash } from 'bcryptjs'

interface Request {
  dataUser: UserType
}

interface Response {
  userCreated: UserEntity
}

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ dataUser }: Request): Promise<Response> {
    const userWithSameEmail = await this.userRepository.findByEmail(
      dataUser.email,
    )
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    const newPassword = await hash(dataUser.password, 6)

    const userCreated = await this.userRepository.create({
      ...dataUser,
      password: newPassword,
    })
    return { userCreated }
  }
}
