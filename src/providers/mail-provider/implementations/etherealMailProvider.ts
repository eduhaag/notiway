import { env } from '@/env'
import { MailProvider, SendMailProps } from '../email-provider'
import nodeMailer, { Transporter } from 'nodemailer'

export class EtherealMailProvider implements MailProvider {
  private client!: Transporter

  constructor() {
    this.client = nodeMailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    })
  }

  async sendMail({ to, body, subject }: SendMailProps): Promise<void> {
    const message = await this.client!.sendMail({
      to,
      from: 'Notiway <noreplay@notiway.com.br>',
      subject,
      text: body,
      html: body,
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(message))
  }
}
