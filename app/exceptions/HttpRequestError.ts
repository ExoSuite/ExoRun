import { BaseError } from "./BaseError"
import { GeneralApiProblem, HttpResponse } from "@services/api"
import { ApiResponse } from "apisauce"
import { translate } from "@i18n"

const baseError = {
  error: [],
}

export class HttpRequestError extends BaseError {
  private readonly status: HttpResponse
  private readonly _data: { errors: Object, message: string }

  constructor(problem: GeneralApiProblem, response: ApiResponse<any>) {
    super()
    this.status = problem.kind
    this._data = response.data || []
  }

  public is(httpResponse: HttpResponse) {
    return this.status === httpResponse
  }

  public isNot(httpResponse: HttpResponse) {
    return this.status !== httpResponse
  }

  public happened(): Object {
    return this._data.errors || {}
  }

  // base message
  public what(): string {
    return this.message
  }

  public code(): HttpResponse {
    return this.status
  }


  public formattedErrors() {
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
        break
      }
    }

    return errors
  }
}
