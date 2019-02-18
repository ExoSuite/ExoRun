import { Api, HttpRequest, HttpResponse } from "@services/api"
import { HttpRequestError } from "@exceptions"

/*test("should initialize API without crashing and returns 404", async () => {
  const instance = new Api()
  await instance.setup()

  const error = await expect(
    instance.request(HttpRequest.GET, "", {}, {}, false),
  ).rejects
  await error.toThrow()
  await error.toThrowError(HttpRequestError)
  await error.toBe(new HttpRequestError({kind: HttpResponse.UNAUTHORIZED}, {}))
})*/

test("Api test should return OK on /monitoring/alive", async () => {
  const instance = new Api()
  await instance.setup()

  const response = await instance.request(
    HttpRequest.GET,
    "monitoring/alive",
    {},
    {},
    false,
  )
  expect(response.status).toEqual(HttpResponse.OK)
})
