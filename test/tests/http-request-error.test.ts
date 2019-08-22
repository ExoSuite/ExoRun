import { HttpRequestError } from "@exceptions/HttpRequestError"
import { GeneralApiProblem, HttpResponse } from "@services/api"

const basicProblem: GeneralApiProblem = {
  kind: HttpResponse.UNAUTHORIZED
}

const errors = {
  "email": [
    "The email field Is required."
  ],
  "password": [
    "The password field Is required."
  ]
};

describe("http request playError tests", () => {

  test("must return correct message", () => {
    try {
      throw new HttpRequestError(basicProblem, {
        config: undefined, data: undefined, duration: 0, headers: {}, originalError: null, status: 0,
        ok: false, problem: "UNKNOWN_ERROR"
      })
    } catch (error) {
      expect(error.what()).toBeDefined()
    }
  })

  test("must return the problem", () => {
    try {
      throw new HttpRequestError(basicProblem, {
        config: undefined, data: undefined, duration: 0, headers: {}, originalError: null, status: 0,
        ok: false, problem: "UNKNOWN_ERROR"
      })
    } catch (error) {
      expect(error.problem()).toEqual(basicProblem)
    }
  })

  test("must return the playError array from server", () => {
    try {
      throw new HttpRequestError(basicProblem, {
        config: undefined, data: { errors }, duration: 0, headers: {}, originalError: null, status: 0,
        ok: false, problem: "UNKNOWN_ERROR"
      })
    } catch (error) {
      expect(error.happened()).toEqual(errors)
    }
  })

  test("must return the playError array from server and format it", () => {
    try {
      throw new HttpRequestError(basicProblem, {
        config: undefined, data: { errors }, duration: 0, headers: {}, originalError: null, status: 0,
        ok: false, problem: "UNKNOWN_ERROR"
      })
    } catch (error) {
      expect(error.formattedErrors()).toBeDefined()
    }
  })

  describe("BaseError http status code related tests ", () => {
    try {
      throw new HttpRequestError(basicProblem, {
        config: undefined, data: { errors }, duration: 0, headers: {}, originalError: null, status: 0,
        ok: false, problem: "UNKNOWN_ERROR"
      })
    } catch (error) {

      test("BaseError 'is' method must return true", () => {
        expect(error.is(HttpResponse.UNAUTHORIZED)).toBeTruthy()
      })

      test("BaseError 'isNot' method must return true", () => {
        expect(error.isNot(HttpResponse.OK)).toBeTruthy()
      })

      test("BaseError 'code' must return the correct http code", () => {
        expect(error.code()).toEqual(HttpResponse.UNAUTHORIZED)
      })

    }

  })

})
