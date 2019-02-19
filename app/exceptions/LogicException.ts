import { BaseError } from "@exceptions/BaseError"

export enum LogicErrorState {
  CANT_LOAD_API_TOKENS,
  MALFORMED_API_TOKENS,
}

export class LogicException extends BaseError {

  constructor(status: LogicErrorState) {
    super(status)
  }
}
