export class EmailAlreadyValidatedError extends Error {
  constructor() {
    super('This e-mail is already validated.')
  }
}
