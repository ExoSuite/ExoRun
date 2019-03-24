/**
 * The options used to configure the API.
 */
import { Build, BuiltFor } from "@services/build-detector"

export interface IApiConfig {

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
  /**
   * The URL of the api.
   */
  url: string
}

let URL: string

// tslint:disable-next-line prefer-conditional-expression
if (Build.is(BuiltFor.DEVELOPMENT) || Build.is(BuiltFor.TESTING)) {
  URL = "https://api.teamexosuite.cloud"
} else {
  URL = "https://api.exosuite.fr"
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: IApiConfig = {
  url: `${URL}/`,
  timeout: 10000
}
