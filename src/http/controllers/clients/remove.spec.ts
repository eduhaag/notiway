import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Remove client e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to remove a client', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'test@example.com',
      password: '123456',
    })

    const consumer = await prisma.consumer.create({
      data: { email: 'johndoe@example.com', name: 'John Doe' },
    })

    const client = await prisma.client.create({
      data: {
        name: 'client-example',
        consumer_id: consumer.id,
        ClientToken: { create: { token: 'token-example' } },
      },
    })

    const response = await request(app.server)
      .delete(`/clients/${client.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    const clientRemoved = await prisma.client.findUnique({
      where: { id: client.id },
    })

    expect(response.statusCode).toEqual(204)
    expect(clientRemoved?.deleted_at).toEqual(expect.any(Date))
  })
})
