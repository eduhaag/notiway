import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Get consumer profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get consumer profile', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
      accessLevl: 10,
    })

    const consumer = await prisma.consumer.create({
      data: {
        email: 'johndoe@example.com',
        name: 'John Doe',
      },
    })

    const response = await request(app.server)
      .get(`/consumers/${consumer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.consumer).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        name: 'John Doe',
      }),
    )
  })
})
