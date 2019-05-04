/**
 * @jest-environment node
 */

import { Api, HttpResponse } from "@services/api"
import { HttpRequestError } from "@exceptions"
import { LogicErrorState, LogicException } from "@exceptions/LogicException"
import Config from "react-native-config"
import { Build, BuiltFor } from "@services/build-detector"

describe("api tests", () => {
  test("should initialize API and throw HttpRequestError", async () => {
    const instance = new Api()
    await instance.setup()

    const error = expect(
      instance.get("user/me", {}, {}, false)
    ).rejects
    await error.toThrow()
    await error.toThrowError(HttpRequestError)
  })

  test("should throw LogicException with LogicErrorState.CANT_LOAD_API_TOKENS", async () => {
    const instance = new Api()
    await instance.setup()

    const error = expect(
      instance.get("user/me", {}, {}, true)
    ).rejects
    await error.toThrow()
    await error.toThrowError(LogicException)

    try {
      await instance.get("user/me", {}, {}, true)
    } catch (exception) {
      expect(exception.code())
        .toEqual(LogicErrorState.CANT_LOAD_API_TOKENS)
    }
  })

  test("Api test should return OK on /monitoring/alive", async () => {
    const instance = new Api()
    await instance.setup()

    const response = await instance.get("monitoring/alive", {}, {}, false)
    expect(response.status).toEqual(HttpResponse.OK)
    expect(response.data)
      .toEqual("OK")
  })

  test("Api config should match dot env file", () => {
    expect(Config.APP_ENV).toEqual(BuiltFor.TESTING)
    expect(Build.Is(BuiltFor.TESTING)).toBeTruthy()
  })

  describe("should launch all types of http methods", () => {

    const api = new Api()

    api.setup().then(() => {

      test("POST request must be successful", () => {
        api.post("monitoring/alive").catch()
      })

      test("PATCH request must be successful", () => {
        api.patch("monitoring/alive").catch()
      })

      test("PUT request must be successful", () => {
        api.put("monitoring/alive").catch()
      })

      test("DELETE request must be successful", () => {
        api.delete("monitoring/alive").catch()
      })

      test("GET request must be successful", () => {
        api.get("/test").catch()
      })

    }).catch()

  })

  test("checkToken must throw LogicException(LogicErrorState.CANT_LOAD_API_TOKENS)", () => {
    const api = new Api()
    api.checkToken().catch((error: LogicException) => {
      expect(error).toBeInstanceOf(LogicException)
      expect(error.code()).toEqual(LogicErrorState.CANT_LOAD_API_TOKENS)
    })
  })

})
