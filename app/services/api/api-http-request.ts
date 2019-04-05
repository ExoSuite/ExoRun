export enum HttpRequest {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export function toApiSauceMethod(request: HttpRequest): string {
  return request.toLowerCase()
}
