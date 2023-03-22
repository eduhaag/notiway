import { FastifyInstance } from 'fastify'
import { verifyAdminAccess } from '@/http/middlewares/verify-admin'
import { verifyJWT } from '../middlewares/verify-jwt'
import { create } from './users/create'
import { update } from './users/update'
import { fetch as fetchUsers } from './users/fetch'
import { fetch as fetchConsumers } from './consumers/fetch'
import { fetchSenders } from './senders/fetch'
import { toggle } from './senders/toggle'
import { updateSender } from './senders/update'

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

  // ------ senders
  app.get(
    '/admin/senders/search',
    { onRequest: [verifyAdminAccess(50)] },
    fetchSenders,
  )
  app.put(
    '/admin/senders/:senderId',
    {
      onRequest: [verifyAdminAccess(50)],
    },
    updateSender,
  )
  app.patch(
    '/admin/senders/:senderId/toggle-enabled',
    {
      onRequest: [verifyAdminAccess(50)],
    },
    toggle,
  )
}
