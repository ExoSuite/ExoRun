import { Api, HttpRequest, HttpResponse } from "app/services/api"

it("initialize API without crashing", () => {
  const instance = new Api().setup()
  return instance
    .request(HttpRequest.GET, "auth/register", {}, {}, false)
    .then(response => {
      console.log(response)
    })
    .catch(e => {
      if (e.message !== HttpResponse.METHOD_NOT_ALLOWED) fail()
    })
})
