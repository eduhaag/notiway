import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

describe('Authenticate e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate an user', async () => {
    await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        password_hash: await hash('123456', 6),
      },
    })

    const response = await request(app.server).post('/site/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('consumer')
  })
})
