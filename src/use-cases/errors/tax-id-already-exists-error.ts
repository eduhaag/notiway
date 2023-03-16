export class TaxIdAlreadyExistsError extends Error {
  constructor() {
    super('Tax ID already exists.')
  }
}
