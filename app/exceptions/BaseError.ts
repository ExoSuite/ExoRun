import { HttpResponse } from "@services/api"
import { LogicException } from "@exceptions/LogicException"

export abstract class BaseError extends Error {
  private readonly _status: HttpResponse | LogicException

  protected constructor(status) {
    super()
    Error.apply(this, arguments)
    this._status = status
  }

  public is(status) {
    return this._status === status
  }

  public isNot(status) {
    return this._status !== status
  }

  public code() {
    return this._status
  }
}
