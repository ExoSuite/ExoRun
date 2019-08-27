import React from "react"
import renderer, { ReactTestRenderer } from "react-test-renderer"
import { App } from "../../../app/app"
import { store } from "../../__mocks__/mock-setup-root-store"

describe("App tested with react-test-renderer", () => {
  beforeAll(() => {
    jest.mock("Platform", () => {
      const Platform = jest.requireActual("Platform")
      Platform.OS = "ios"

      return Platform
    })

  })

  test("App match snapshot ReactTestRenderer", () => {

    const app: ReactTestRenderer = renderer.create(
      <App/>
    )

    // @ts-ignore
    app.root.instance.setState(store)

    const json = app.toJSON()
    expect(json).toMatchSnapshot()
  })
})
