import { Prisma, User, UserToken } from '@prisma/client'

export interface UserTokensRepository {
  create(data: Prisma.UserTokenUncheckedCreateInput): Promise<UserToken>
  delete(token: string): Promise<void>
  findByToken(token: string): Promise<(UserToken & { user: User }) | null>
  findByUserId(userId: string): Promise<UserToken[]>
}
