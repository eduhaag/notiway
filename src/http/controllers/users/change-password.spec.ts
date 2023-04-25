import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Change user password e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to change user password', async () => {
    const { token } = await createAndAuthenticateUser(app, {
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server)
      .patch('/site/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: '123456', newPassword: 'abcdef' })

    expect(response.statusCode).toEqual(204)
  })
})
