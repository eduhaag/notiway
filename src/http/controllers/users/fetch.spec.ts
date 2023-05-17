import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Fetch users (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch users', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'admin@example.com',
      password: '123456',
      accessLevl: 50,
    })

    await prisma.user.createMany({
      data: [
        {
          email: 'user1@example.com',
          password_hash: 'password1',
          access_level: 10,
        },
        {
          email: 'user2@example.com',
          password_hash: 'password2',
          access_level: 20,
        },
        {
          email: 'user3@example.com',
          password_hash: 'password3',
          access_level: 40,
        },
      ],
    })

    const response = await request(app.server)
      .get('/admin/users')
      .query({ accessLevel: 20 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(3)
    expect(response.body.users).toEqual([
      expect.objectContaining({}),
      expect.objectContaining({
        email: 'user2@example.com',
      }),
      expect.objectContaining({
        email: 'user3@example.com',
      }),
    ])
  })
})
