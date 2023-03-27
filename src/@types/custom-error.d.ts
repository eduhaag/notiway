declare module global {
  export interface Error {
    cause: Object
    config: Object
  }
}
