import { getGeneralApiProblem, HttpResponse } from "@services/api"
import { ApiErrorResponse } from "apisauce"

test("handles connection errors", () => {
  expect(getGeneralApiProblem({ problem: "CONNECTION_ERROR" } as ApiErrorResponse<null>)).toEqual({
    kind: HttpResponse.CANNOT_CONNECT,
    temporary: true,
  })
})

test("handles network errors", () => {
  expect(getGeneralApiProblem({ problem: "NETWORK_ERROR" } as ApiErrorResponse<null>)).toEqual({
    kind: HttpResponse.CANNOT_CONNECT,
    temporary: true,
  })
})

test("handles timeouts", () => {
  expect(getGeneralApiProblem({ problem: "TIMEOUT_ERROR" } as ApiErrorResponse<null>)).toEqual({
    kind: HttpResponse.TIMEOUT,
    temporary: true,
  })
})

test("handles server errors", () => {
  expect(getGeneralApiProblem({ problem: "SERVER_ERROR" } as ApiErrorResponse<null>)).toEqual({
    kind: HttpResponse.SERVER_ERROR,
  })
})

test("handles unknown errors", () => {
  expect(getGeneralApiProblem({ problem: "UNKNOWN_ERROR" } as ApiErrorResponse<null>)).toEqual({
    kind: HttpResponse.UNKNOWN,
    temporary: true,
  })
})

test("handles unauthorized errors", () => {
  expect(
    getGeneralApiProblem({ problem: "CLIENT_ERROR", status: 401 } as ApiErrorResponse<null>),
  ).toEqual({
    kind: HttpResponse.UNAUTHORIZED,
  })
})

test("handles forbidden errors", () => {
  expect(
    getGeneralApiProblem({ problem: "CLIENT_ERROR", status: 403 } as ApiErrorResponse<null>),
  ).toEqual({
    kind: HttpResponse.FORBIDDEN,
  })
})

test("handles not-found errors", () => {
  expect(
    getGeneralApiProblem({ problem: "CLIENT_ERROR", status: 404 } as ApiErrorResponse<null>),
  ).toEqual({
    kind: HttpResponse.NOT_FOUND,
  })
})

test("handles other client errors", () => {
  expect(
    getGeneralApiProblem({ problem: "CLIENT_ERROR", status: 418 } as ApiErrorResponse<null>),
  ).toEqual({
    kind: HttpResponse.REJECTED,
  })
})

test("handles cancellation errors", () => {
  expect(getGeneralApiProblem({ problem: "CANCEL_ERROR" } as ApiErrorResponse<null>)).toBeNull()
})
