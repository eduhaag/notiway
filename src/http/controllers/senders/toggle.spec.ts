import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { api } from '@/lib/axios'

const mock = vi.spyOn(api, 'post').mockImplementation(async (data) => {
  if (data.includes('close-session')) {
    return { data: { status: true } }
  }
})

describe('Toggle sender e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.only('should be able to toggle sender', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'test@example.com',
      password: '123456',
      accessLevl: 50,
    })

    const sender = await prisma.sender.create({
      data: {
        name: 'sender-example',
        full_number: '+5547999999999',
        type: 'SHARED',
        api_token: 'api-token',
      },
    })

    const response = await request(app.server)
      .patch(`/admin/senders/${sender.id}/toggle-enabled`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        isEnabled: false,
      })

    expect(response.statusCode).toEqual(204)
    expect(mock).toHaveBeenCalledTimes(1)
  })
})
