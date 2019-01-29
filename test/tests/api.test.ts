import { Api, HttpRequest, HttpResponse } from "app/services/api"

it("should initialize API without crashing", () => {
  const instance = new Api().setup()
  return instance
    .request(HttpRequest.GET, "auth/register", {}, {}, false)
    .then(response => {
      fail()
    })
    .catch(e => {
      if (e.message !== HttpResponse.METHOD_NOT_ALLOWED) fail()
    })
})

it("should return 404", function() {
  const instance = new Api().setup()
  return instance
    .request(HttpRequest.GET, "", {}, {}, false)
    .then(response => {
      fail()
    })
    .catch(e => {
      if (e.message !== HttpResponse.NOT_FOUND) fail()
    })
})
