import { MailProvider, SendMailProps } from '../email-provider'
import nodeMailer, { Transporter } from 'nodemailer'

export class EtherealMailProvider implements MailProvider {
  private client!: Transporter

  constructor() {
    nodeMailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodeMailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        })

        this.client = transporter
      })
      .catch((error) => {
        console.log(error)
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
