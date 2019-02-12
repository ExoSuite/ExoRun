export abstract class BaseError extends Error {
  protected constructor() {
    super()
    Error.apply(this, arguments)
  }
}
