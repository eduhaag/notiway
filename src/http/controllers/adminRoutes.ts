import { FastifyInstance } from 'fastify'
import { verifyAdminAccess } from '@/http/middlewares/verify-admin'
import { verifyJWT } from '../middlewares/verify-jwt'
import { create } from './users/create'
import { update } from './users/update'
import { fetch as fetchUsers } from './users/fetch'
import { fetch as fetchConsumers } from './consumers/fetch'

export async function adminRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  // ------- users
  app.post('/admin/users', { onRequest: [verifyAdminAccess(50)] }, create)
  app.put(
    '/admin/users/:userId',
    { onRequest: [verifyAdminAccess(50)] },
    update,
  )
  app.get('/admin/users', { onRequest: [verifyAdminAccess(50)] }, fetchUsers)

  // ------ consumers
  app.get(
    '/admin/consumers/search',
    {
      onRequest: [verifyAdminAccess(50)],
    },
    fetchConsumers,
  )
}
