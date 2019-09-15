import React from "react"
import renderer, { ReactTestRenderer } from "react-test-renderer"
import { App } from "../../../app/app"
import { appState } from "../../__mocks__/mock-setup-root-store"

describe("App tested with react-test-renderer", () => {
  beforeAll(() => {
    jest.mock("Platform", () => {
      const Platform = jest.requireActual("Platform")
      Platform.OS = "ios"

      return Platform
    })

  })

  test("App match snapshot ReactTestRenderer", () => {

    const app: ReactTestRenderer = renderer.create(<App/>)

    expect(app.root.instance.render()).toBeNull()

    app.root.instance.setState(appState)

    const json = app.toJSON()
    expect(json).toMatchSnapshot()
  })
})
