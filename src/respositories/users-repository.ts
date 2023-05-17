import { Consumer, Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserUncheckedCreateInput): Promise<User>
  save(user: User): Promise<void>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<
    | (User & {
        consumer: Consumer | null
      })
    | null
  >
  getAll(accessLevel?: number): Promise<User[]>
}
