import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyAdminAccess(requestLevel: number) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { access_level } = request.user

    if (access_level < requestLevel) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
