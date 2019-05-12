import { translate } from "@i18n"
import { GeneralApiProblem, HttpResponse } from "@services/api"
import { ApiResponse } from "apisauce"
import { BaseError } from "./BaseError"

const baseError = {
  error: []
}

/**
 * * HttpRequestError will be thrown by api.ts:134:7 in case of an HTTP error
 */
export class HttpRequestError extends BaseError {

  // tslint:disable-next-line variable-name
  private readonly _problem: GeneralApiProblem
  private readonly data: { errors: object; message: string }

  constructor(problem: GeneralApiProblem, response: ApiResponse<any>) {
    super(problem.kind)
    this.data = response.data || []
    this._problem = problem
  }

  public formattedErrors(): object {
    let errors
    switch (this.code()) {
      case HttpResponse.UNAUTHORIZED: {
        errors = baseError
        errors.error = [translate("errors.unauthorized")]
        break
      }
      // get errors from server
      case HttpResponse.UNPROCESSABLE_ENTITY: {
        errors = this.happened()
        break
      }
      default: {
        errors = baseError
        errors.error = [translate("errors.unknown")]
      }
    }

    return errors
  }

  public happened(): object {
    return this.data.errors || {}
  }

  public problem(): GeneralApiProblem {
    return this._problem
  }

  // base message
  public what(): string {
    return this.message
  }
}
