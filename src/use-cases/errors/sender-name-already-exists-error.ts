export class SenderNameAlreadyExists extends Error {
  constructor() {
    super('This sender name already exists.')
  }
}
