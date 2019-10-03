import { ApiResponse } from "apisauce"
import { HttpResponse } from "./api-http-response"

export type GeneralApiProblem =
/**
 * Times up.
 */
  | { kind: HttpResponse.TIMEOUT; temporary: true }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: HttpResponse.CANNOT_CONNECT; temporary: true }
  /**
   * The server experienced a problem. Any 5xx playError.
   */
  | { kind: HttpResponse.SERVER_ERROR }
  /**
   * We're not allowed because we haven't identified ourself. This Is 401.
   */
  | { kind: HttpResponse.UNAUTHORIZED }
  /**
   * We don't have access to perform that request. This Is 403.
   */
  | { kind: HttpResponse.FORBIDDEN }
  /**
   * Unable to find that resource.  This Is a 404.
   */
  | { kind: HttpResponse.NOT_FOUND }
  /**
   * All other 4xx series errors.
   */
  | { kind: HttpResponse.REJECTED }
  /**
   * Something truly unexpected happened. Most likely can try again. This Is a catch all.
   */
  | { kind: HttpResponse.UNKNOWN; temporary: true }
  /**
   * The data we received Is not in the expected format.
   */
  | { kind: HttpResponse.UNPROCESSABLE_ENTITY }

  /**
   * request was not with the correct HTTP method.
   */
  | { kind: HttpResponse.METHOD_NOT_ALLOWED }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<any>): GeneralApiProblem {
  switch (response.problem) {
    case "NETWORK_ERROR":
    case "CONNECTION_ERROR":
      return { kind: HttpResponse.CANNOT_CONNECT, temporary: true }

    case "TIMEOUT_ERROR":
      return { kind: HttpResponse.TIMEOUT, temporary: true }
    case "SERVER_ERROR":
      return { kind: HttpResponse.SERVER_ERROR }
    case "UNKNOWN_ERROR":
      return { kind: HttpResponse.UNKNOWN, temporary: true }
    case "CLIENT_ERROR":
      // tslint:disable-next-line no-nested-switch
      switch (response.status) {
        case 401:
          return { kind: HttpResponse.UNAUTHORIZED }
        case 403:
          return { kind: HttpResponse.FORBIDDEN }
        case 404:
          return { kind: HttpResponse.NOT_FOUND }
        case 405:
          return { kind: HttpResponse.METHOD_NOT_ALLOWED }
        case 422:
          return { kind: HttpResponse.UNPROCESSABLE_ENTITY }
        default:
          return { kind: HttpResponse.REJECTED }
      }
    case "CANCEL_ERROR":
      return null
    default:
      return null
  }

  return null
}
