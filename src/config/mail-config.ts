import { env } from '@/env'

export const mailConfig =
  env.NODE_ENV === 'production'
    ? {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_PASS,
        },
      }
    : {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'willy83@ethereal.email',
          pass: 'UMxGnWTsnAEAJnkwpD',
        },
      }
