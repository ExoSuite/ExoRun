/**
 * @jest-environment jsdom
 */
import * as React from "react"
import { ModalMock } from "../ModalMock"
import { App } from "../../../../app/app"
import { mount } from "enzyme"
import { spy } from "sinon"
import { StatefulNavigator } from "@navigation/stateful-navigator"
import { store } from "../../../__mocks__/mock-setup-root-store"
import { DataLoader } from "@components/data-loader"

spy(App.prototype, "componentDidMount")

describe("App tested with airbnb enzyme", () => {

  beforeAll(() => {
    jest.mock("Platform", () => {
      const Platform = jest.requireActual("Platform")
      Platform.OS = "ios"

      return Platform
    })

    jest.mock("react-native-modal", () => ModalMock)
  })

  test("mount call componentDidMount", () => {
    mount<App>(<App/>)
    expect(App.prototype.componentDidMount).toHaveProperty("callCount", 1)
  })

  test("render correctly", () => {
    const wrapper = mount<App>(<App/>)
    // @ts-ignore
    wrapper.setState(store)
    expect(wrapper.find(StatefulNavigator)).toExist()
    expect(wrapper.find(DataLoader)).toExist()
  })
})
