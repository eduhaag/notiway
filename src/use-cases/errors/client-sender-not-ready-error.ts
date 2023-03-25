export class ClientSenderNotReadyError extends Error {
  constructor() {
    super('Client sender not ready.')
  }
}
