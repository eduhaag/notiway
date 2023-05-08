import { Prisma, UserToken } from '@prisma/client'

export interface UserTokensRepository {
  create({
    user_id,
    expires_date,
  }: Prisma.UserTokenUncheckedCreateInput): Promise<UserToken>
  delete(token: string): Promise<void>
  findByToken(token: string): Promise<UserToken | null>
}
