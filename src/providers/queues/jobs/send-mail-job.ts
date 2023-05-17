import { SendMailProps } from '@/providers/mail-provider/email-provider'
import { NodeMailer } from '@/providers/mail-provider/implementations/nodeMailer'
import { Job } from 'bull'

export default {
  key: 'sendMail',
  async handle({ data }: Job<SendMailProps>) {
    const { to, path, variables, subject, from } = data

    const mailProvider = new NodeMailer()

    mailProvider.sendMail({
      to,
      path,
      variables,
      subject,
      from,
    })
  },
}
