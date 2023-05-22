import { SendMailProps } from '@/providers/mail-provider/email-provider'
import { NodeMailer } from '@/providers/mail-provider/implementations/nodeMailer'

export async function sendMail(data: SendMailProps) {
  const { path, subject, to, from, variables } = data

  const mailProvider = new NodeMailer()

  mailProvider.sendMail({
    to,
    path,
    variables,
    subject,
    from,
  })
}
