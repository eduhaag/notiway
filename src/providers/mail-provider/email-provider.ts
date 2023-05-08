export interface SendMailProps {
  to: string
  subject: string
  body: string
}

export interface MailProvider {
  sendMail(data: SendMailProps): Promise<void>
}
