import { BaseError } from "@exceptions/BaseError"

export enum LogicErrorState {
  CANT_LOAD_API_TOKENS,
  CANT_FETCH_PERSONAL_TOKENS,
  MALFORMED_API_TOKENS,
}

/**
 * * LogicException can be thrown when a logic exception occurs like
 */
export class LogicException extends BaseError {

  constructor(status: LogicErrorState) {
    super(status)
  }
}
