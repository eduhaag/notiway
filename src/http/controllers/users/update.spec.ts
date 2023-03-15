import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Update user e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update user', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'admin@example.com',
      password: '123456',
      accessLevl: 50,
    })

    const user = await prisma.user.create({
      data: { email: 'johndoe@example.com', password_hash: 'abcdef' },
    })

    const response = await request(app.server)
      .put(`/admin/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ accessLevel: 20 })

    expect(response.statusCode).toEqual(204)
  })
})
