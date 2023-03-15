export class WrongOldPasswordError extends Error {
  constructor() {
    super('Old password is wrong.')
  }
}
