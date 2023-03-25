export class ClientNotAuthorizedError extends Error {
  constructor() {
    super('Unauthorized')
  }
}
