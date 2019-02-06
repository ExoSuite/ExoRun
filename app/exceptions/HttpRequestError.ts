import { BaseError } from "./BaseError"
import { GeneralApiProblem, HttpResponse } from "@services/api"
import { ApiResponse } from "apisauce"

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

}
