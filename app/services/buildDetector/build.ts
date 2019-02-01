import { ENV } from "@utils/environment-variables"
import includes from "lodash.includes"
import Config from "react-native-config"

export enum BuiltFor {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
  TESTING = "test",
}

export class Build {
  static is(builtFor: BuiltFor) {
    if (ENV === undefined) {
      return includes(builtFor, Config.APP_ENV)
    }
    return ENV === builtFor
  }
}
