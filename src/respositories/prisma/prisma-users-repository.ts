import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { prisma } from '@/lib/prisma'

export class PrismaUsesrRepository implements UsersRepository {
  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = await prisma.user.create({ data })

    return user
  }

  async save(user: User) {
    await prisma.user.update({
      where: { id: user.id },
      data: user,
    })
  }

  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  }

  async getAll() {
    return await prisma.user.findMany()
  }
}
