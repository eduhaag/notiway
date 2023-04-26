import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Update client e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update client', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
    })

    const consumer = await prisma.consumer.create({
      data: { email: 'johndoe@example.com', name: 'John Doe' },
    })

    const client = await prisma.client.create({
      data: {
        consumer_id: consumer.id,
        name: 'example-client',
      },
    })

    const response = await request(app.server)
      .put(`/site/clients/${client.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'client updated', status: 'new status' })

    expect(response.statusCode).toEqual(204)
  })
})
