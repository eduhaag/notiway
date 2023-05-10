import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { refresh } from './refresh'
import { changePassword } from './change-password'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { logout } from './logout'
import { forgotPassword } from './forgot-password'
import { resetPassword } from './reset-password'
import { mailVerify } from './mail-verify'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
  app.patch('/sessions/logout', logout)
  app.post('/users/forgot-password', forgotPassword)
  app.patch('/users/verify', mailVerify)
  app.patch('/users/reset-password', resetPassword)

  app.patch('/token/refresh', refresh)

  app.patch('/users/change-password', { onRequest: verifyJWT }, changePassword)
}
