export interface SendMailProps {
  from?: string
  to: string
  subject: string
  variables?: any
  path: string
}

export interface MailProvider {
  sendMail(data: SendMailProps): Promise<void>
}
