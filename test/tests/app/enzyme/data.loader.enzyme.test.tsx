/**
 * @jest-environment jsdom
 */
import * as React from "react"
import { mount } from "enzyme"
import { DataLoader } from "@components/data-loader"
import { ModalMock } from "../ModalMock"
import Modal from "react-native-modal"
import { View } from "react-native"
import AnimatedLottieView from "lottie-react-native"
import { View as AnimatedView } from "react-native-animatable"
import { FormRow } from "@components/form-row"
import { LoaderState } from "@components/data-loader/data-loader.types"

describe("data loader tests", () => {
  let wrapper

  beforeAll(() => {
    jest.mock("react-native-modal", () => ModalMock)
    wrapper = mount<DataLoader>(<DataLoader/>)
  })

  test("render correctly and have child components", () => {
    expect(wrapper).not.toBeEmptyRender()
    expect(wrapper.find(Modal)).toExist()
    expect(wrapper.find(View)).toExist()
    expect(wrapper.find(AnimatedLottieView)).toExist()
    expect(wrapper.find(AnimatedView)).toExist()
    expect(wrapper.find(FormRow)).toExist()
  })

  test("on error should update", () => {
    const errors = {
      "email": [
        "The email field Is required."
      ],
      "password": [
        "The password field Is required."
      ]
    };
    expect(wrapper.instance().status).toEqual(LoaderState.STANDBY)
    wrapper.instance().hasErrors(errors)
    expect(wrapper.find(AnimatedLottieView)).not.toBeEmptyRender()
    expect(wrapper.instance().isVisible).toBeTruthy()
    expect(wrapper.instance().errors).toEqual(errors)
    expect(wrapper.instance().status).toEqual(LoaderState.ERROR)
  })

  test("on success should update", () => {
    wrapper.instance().success()
    expect(wrapper.find(AnimatedLottieView)).not.toBeEmptyRender()
    expect(wrapper.instance().status).toEqual(LoaderState.SUCCESS)
  })

  test("on dataloader toggle status change", () => {
    wrapper.instance().toggleIsVisible()
    expect(wrapper.instance().status).toEqual(LoaderState.STANDBY)
  })

})
