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
    return builtFor === Config.APP_ENV
  }

  public static isNot(builtFor: BuiltFor): boolean {
    return !Build.is(builtFor)
  }
}
