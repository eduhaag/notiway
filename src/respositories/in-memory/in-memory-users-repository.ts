import { randomUUID } from 'node:crypto'
import { Consumer, Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  users: User[] = []

  async create(data: Prisma.UserUncheckedCreateInput) {
    const user = {
      id: randomUUID(),
      email: data.email,
      password_hash: data.password_hash,
      access_level: data.access_level ?? 10,
      consumer_id: data.consumer_id ?? null,
    }

    this.users.push(user)

    return user
  }

  async save(user: User) {
    const userIndex = this.users.findIndex((item) => item.id === user.id)

    this.users[userIndex] = user
  }

  async findById(id: string) {
    return this.users.find((item) => item.id === id) ?? null
  }

  async findByEmail(email: string) {
    const data = this.users.find((item) => item.email === email) ?? null

    if (!data) {
      return null
    }

    const user: User & {
      consumer: Consumer | null
    } = {
      ...data,
      consumer: null,
    }

    return user
  }

  async getAll(accessLevel: number) {
    if (accessLevel) {
      return this.users.filter((user) => user.access_level >= accessLevel)
    }

    return this.users
  }
}
