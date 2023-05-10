import nodeMailer, { Transporter } from 'nodemailer'
import handleBars from 'handlebars'
import fs from 'fs'

import { MailProvider, SendMailProps } from '../email-provider'
import { mailConfig } from '@/config/mail-config'

export class NodeMailer implements MailProvider {
  private client!: Transporter

  constructor() {
    this.client = nodeMailer.createTransport(mailConfig)
  }

  async sendMail({
    to,
    subject,
    variables,
    path,
    from,
  }: SendMailProps): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handleBars.compile(templateFileContent)

    const templateHtml = templateParse(variables)

    const message = await this.client!.sendMail({
      to,
      from,
      subject,
      html: templateHtml,
    })

    console.log('Message sent: %s', message.messageId)
    console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(message))
  }
}
