import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    token: string
  }
}
