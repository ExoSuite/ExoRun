/**
 * @jest-environment node
 */

import { Build, BuiltFor } from "@services/build-detector"
import { appVersion, buildVersion } from "../__mocks__/react-native-version-info"

describe("build version tests", () => {

  test("Build version Is correctly generated with Native version", () => {
    expect(Build.Version()).toEqual(`${appVersion}-${buildVersion}-test`)
  })

  test("Build Is testing", () => {
    expect(Build.Is(BuiltFor.TESTING)).toBeTruthy()
  })

  test("Build IsNot testing", () => {
    expect(Build.IsNot(BuiltFor.TESTING)).toBeFalsy()
  })
})
