import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create user e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new user', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'admin@example.com',
      password: '123456',
      accessLevl: 50,
    })

    const response = await request(app.server)
      .post('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toEqual(201)
  })
})
