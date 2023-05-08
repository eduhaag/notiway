import { Prisma } from '@prisma/client'
import { UserTokensRepository } from '../user-tokens-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUserTokensRepository implements UserTokensRepository {
  async create({
    user_id,
    expires_date,
  }: Prisma.UserTokenUncheckedCreateInput) {
    return await prisma.userToken.create({ data: { expires_date, user_id } })
  }

  async delete(token: string) {
    await prisma.userToken.delete({ where: { token } })
  }

  async findByToken(token: string) {
    return await prisma.userToken.findUnique({ where: { token } })
  }
}
