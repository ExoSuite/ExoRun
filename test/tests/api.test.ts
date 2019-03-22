import { Api, HttpRequest, HttpResponse } from "@services/api"
import { HttpRequestError } from "@exceptions"
import { LogicErrorState, LogicException } from "@exceptions/LogicException"

test("should initialize API and throw HttpRequestError", async () => {
  const instance = new Api()
  await instance.setup()

  const error = expect(
    instance.request(HttpRequest.GET, "user/me", {}, {}, false),
  ).rejects
  await error.toThrow()
  await error.toThrowError(HttpRequestError)
})

test("should throw LogicException with LogicErrorState.CANT_LOAD_API_TOKENS", async () => {
  const instance = new Api()
  await instance.setup()

  const error = expect(
    instance.request(HttpRequest.GET, "user/me", {}, {}, true),
  ).rejects
  await error.toThrow()
  await error.toThrowError(LogicException)

  try {
    await instance.request(HttpRequest.GET, "user/me", {}, {}, true)
  } catch (exception) {
    expect(exception.code())
      .toEqual(LogicErrorState.CANT_LOAD_API_TOKENS)
  }
})

test("Api test should return OK on /monitoring/alive", async () => {
  const instance = new Api()
  await instance.setup()

  const response = await instance.request(HttpRequest.GET, "monitoring/alive", {}, {}, false)
  expect(response.status).toEqual(HttpResponse.OK)
  expect(response.data)
    .toEqual("OK")
})
