import { BuiltFor } from "@services/build-detector"

const conf = {
  APP_ENV: BuiltFor.TESTING,
  STORYBOOK_ENABLED: "false",
  VERSION: BuiltFor.TESTING
}

// tslint:disable
export default conf

jest.mock("react-native-config", () => conf)
