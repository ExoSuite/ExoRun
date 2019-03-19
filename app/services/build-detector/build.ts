import { ENV } from "@utils/environment-variables"
import includes from "lodash.includes"
import Config from "react-native-config"

export enum BuiltFor {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
  STAGING = "staging",
  TESTING = "test",
}

/**
 * check if app is running with local build etc...
 * @class Build
 */
export class Build {
  public static is(builtFor: BuiltFor): boolean {
    if (ENV === undefined) {
      return includes(builtFor, Config.APP_ENV)
    }

    return ENV === builtFor
  }
}
