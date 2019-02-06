/**
 * The options used to configure the API.
 */
import { Build, BuiltFor } from "@services/build-detector"

export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}

let URL: string

if (Build.is(BuiltFor.DEVELOPMENT) || Build.is(BuiltFor.TESTING)) {
  URL = "https://api.dev.exosuite.fr"
} else {
  URL = "https://api.exosuite.fr"
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: `${URL}/`,
  timeout: 10000
}
