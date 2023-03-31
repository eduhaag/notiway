export class ClientSenderNotReadyError extends Error {
  constructor() {
    super('Sender not ready.')
  }
}
