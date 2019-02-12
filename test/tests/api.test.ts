import { Api, HttpRequest, HttpResponse } from "@services/api"
import { HttpRequestError } from "@exceptions"

it("should initialize API without crashing", () => {
  const instance = new Api()
  instance.setup()
  return instance
    .request(HttpRequest.GET, "auth/register", {}, {}, false)
    .then(() => {
      fail("Request must throw an error")
    })
    .catch((e: HttpRequestError) => {
      if (!e.isNot || e.isNot(HttpResponse.METHOD_NOT_ALLOWED))
        fail(e.what ? e.what() : e)
    })
})

it("should return 404", function() {
  const instance = new Api()
  instance.setup()
  return instance
    .request(HttpRequest.GET, "", {}, {}, false)
    .then(() => {
      fail()
    })
    .catch((e: HttpRequestError) => {
      if (!e.is || e.is(HttpResponse.METHOD_NOT_ALLOWED)) fail(e.what ? e.what() : e)
    })
})
