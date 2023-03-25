export class ClientNotReadyError extends Error {
  constructor() {
    super('Client not ready.')
  }
}
