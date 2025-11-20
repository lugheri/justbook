import { Prisma } from '@prisma/client'
import { UserEntity } from '../../entities/User.entity'

export interface IUserRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<UserEntity>
  get(id: number): Promise<UserEntity | null>
  list(
    page: number,
    active: number,
    email?: string,
    name?: string,
  ): Promise<{
    users: UserEntity[]
    meta: { page: number; perPage: number; totalCount: number }
  }>
  update(id: number, data: Prisma.UserUncheckedUpdateInput): Promise<UserEntity>
  delete(id: number): Promise<boolean>

  listAll(active: number): Promise<UserEntity[]>
  findByName(name: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
}
