import { Build, BuiltFor } from "@services/build-detector"
import { appVersion, buildVersion } from "../__mocks__/react-native-version-info"

describe("build version tests", () => {

  test("Build version is correctly generated with Native version", () => {
    expect(Build.version()).toEqual(`${appVersion}-${buildVersion}-test`)
  })

  test("Build is testing", () => {
    expect(Build.is(BuiltFor.TESTING)).toBeTruthy()
  })

  test("Build isNot testing", () => {
    expect(Build.isNot(BuiltFor.TESTING)).toBeFalsy()
  })
})
