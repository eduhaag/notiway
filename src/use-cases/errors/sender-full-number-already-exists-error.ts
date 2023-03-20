export class SenderFullNumberAlreadyExists extends Error {
  constructor() {
    super('This full number already exists.')
  }
}
