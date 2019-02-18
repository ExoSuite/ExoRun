export enum HttpResponse {
  TIMEOUT = "timeout",
  CANNOT_CONNECT = "cannot-connect",
  NOT_FOUND = "not-found",
  SERVER_ERROR = "server",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  REJECTED = "rejected",
  UNKNOWN = "unknown",
  UNPROCESSABLE_ENTITY = "bad-data",
  METHOD_NOT_ALLOWED = "method-not-allowed",
  OK = 200,
}
