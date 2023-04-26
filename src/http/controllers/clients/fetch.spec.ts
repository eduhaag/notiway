import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Fetch clients e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to fetch clients', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'test@example.com',
      password: '123456',
    })

    const consumer = await prisma.consumer.create({
      data: { email: 'johndoe@example.com', name: 'John Doe' },
    })

    await prisma.client.createMany({
      data: [
        { consumer_id: consumer.id, name: 'client-1' },
        { consumer_id: consumer.id, name: 'client-2' },
        { consumer_id: consumer.id, name: 'client-3' },
      ],
    })

    const response = await request(app.server)
      .get(`/site/consumers/${consumer.id}/clients`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.clients).toHaveLength(3)
    expect(response.body.clients).toEqual([
      expect.objectContaining({ name: 'client-1' }),
      expect.objectContaining({ name: 'client-2' }),
      expect.objectContaining({ name: 'client-3' }),
    ])
  })
})
