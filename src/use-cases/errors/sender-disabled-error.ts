export class SenderDisablerError extends Error {
  constructor() {
    super('This sender is disabled.')
  }
}
