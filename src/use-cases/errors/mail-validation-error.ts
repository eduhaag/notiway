export class MailValidationError extends Error {
  constructor() {
    super('E-mail is not validated.')
  }
}
