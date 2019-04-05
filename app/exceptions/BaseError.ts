import { LogicErrorState } from "@exceptions/LogicException"
import { HttpResponse } from "@services/api"

type IStatus = HttpResponse | LogicErrorState

/**
 * * BaseError class define an abstract pattern who can be used to create your own Exception class.
 */
export abstract class BaseError extends Error {

  private readonly status: IStatus

  protected constructor(status: IStatus) {
    super()
    Error.apply(this, arguments)
    this.status = status
  }

  public code(): IStatus {
    return this.status
  }

  public is(status: IStatus): boolean {
    return this.status === status
  }

  public isNot(status: IStatus): boolean {
    return this.status !== status
  }
}
