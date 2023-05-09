export interface SendMailProps {
  to: string
  subject: string
  variables: any
  path: string
}

export interface MailProvider {
  sendMail(data: SendMailProps): Promise<void>
}
