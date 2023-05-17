import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  APP_PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  MONGO_DATABASE_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_PASSWORD: z.string().optional(),
  JWT_SECRET: z.string(),
  CLIENT_TOKEN_SECRET: z.string(),
  SENTRY_DNS: z.string(),
  WPP_SECRET: z.string(),
  WPP_URL: z.string(),
  WPP_URL_SOCKET: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log('❌ Invalid enviroment variables', _env.error.format())

  throw new Error('Invalid enviroment variables')
}

export const env = _env.data
