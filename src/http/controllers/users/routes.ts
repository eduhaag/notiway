import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refresh } from './refresh'
import { changePassword } from './change-password'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { logout } from './logout'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
  app.patch('/sessions/logout', logout)

  app.patch('/token/refresh', refresh)

  app.patch('/users/change-password', { onRequest: verifyJWT }, changePassword)
}
