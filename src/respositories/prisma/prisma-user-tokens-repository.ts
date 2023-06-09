import { Prisma } from '@prisma/client'
import { UserTokensRepository } from '../user-tokens-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUserTokensRepository implements UserTokensRepository {
  async create({
    user_id,
    expires_date,
    type,
  }: Prisma.UserTokenUncheckedCreateInput) {
    return await prisma.userToken.create({
      data: { expires_date, user_id, type },
    })
  }

  async delete(token: string) {
    await prisma.userToken.delete({ where: { token } })
  }

  async findByToken(token: string) {
    return await prisma.userToken.findUnique({
      where: { token },
      include: { user: true },
    })
  }

  async findByUserId(userId: string) {
    return prisma.userToken.findMany({ where: { user_id: userId } })
  }
}
