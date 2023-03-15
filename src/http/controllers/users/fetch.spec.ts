import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Check-in history (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the user check-in history', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'admin@example.com',
      password: '123456',
      accessLevl: 50,
    })

    await prisma.user.createMany({
      data: [
        { email: 'user1@example.com', password_hash: 'password1' },
        { email: 'user2example.com', password_hash: 'password2' },
      ],
    })

    const response = await request(app.server)
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(3)
    expect(response.body.users).toEqual([
      expect.objectContaining({}),
      expect.objectContaining({
        email: 'user1@example.com',
      }),
      expect.objectContaining({
        email: 'user2example.com',
      }),
    ])
  })
})
