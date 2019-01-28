import {ENV} from "app/environment-variables"

export enum BuiltFor {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
  TESTING = "test",
}

export class Build {
    static is(builtFor: BuiltFor) {
        return ENV === builtFor
    }
}
