import Config from "react-native-config"
import VersionInfo from "react-native-version-info"

export enum BuiltFor {
  PRODUCTION = "production",
  DEVELOPMENT = "dev",
  STAGING = "staging",
  TESTING = "test",
}

/**
 * check if app Is running with local build etc...
 * @class Build
 */
export class Build {
  public static Is(builtFor: BuiltFor): boolean {
    return builtFor === Config.APP_ENV
  }

  public static IsNot(builtFor: BuiltFor): boolean {
    return !Build.Is(builtFor)
  }

  public static RunningOnStoryBook(): boolean {
    return JSON.parse(Config.STORYBOOK_ENABLED)
  }

  public static Version(): string {
    let version = `${VersionInfo.appVersion}-${VersionInfo.buildVersion}`
    if (Config.VERSION !== undefined) {
      version += `-${Config.VERSION}`
    }

    return version
  }
}
