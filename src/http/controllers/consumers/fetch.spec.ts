import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Fetch consumers (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get fetch consumers', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'admin@example.com',
      password: '123456',
      accessLevl: 50,
    })

    await prisma.consumer.createMany({
      data: [
        {
          email: 'user1@example.com',
          name: 'user 1',
        },
        {
          email: 'user2@example.com',
          name: 'user 2',
        },
        {
          email: 'user3@example.com',
          name: 'user 3',
        },
      ],
    })

    const response = await request(app.server)
      .get('/admin/consumers/search')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.consumers).toHaveLength(3)
    expect(response.body.consumers).toEqual([
      expect.objectContaining({
        email: 'user1@example.com',
      }),
      expect.objectContaining({
        email: 'user2@example.com',
      }),
      expect.objectContaining({
        email: 'user3@example.com',
      }),
    ])
  })
})
