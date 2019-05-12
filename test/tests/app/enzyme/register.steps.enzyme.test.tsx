/**
 * @jest-environment jsdom
 */
import * as React from "react"
import { mount } from "enzyme"
import { FirstStepRegisterScreen, SecondStepRegisterScreenImpl } from "@screens/auth"
import { Image, SafeAreaView } from "react-native"
import { Screen } from "@components/screen"
import { AnimatedInteractiveInput } from "@components/animated-interactive-input"
import { FormRow } from "@components/form-row"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"

describe("register steps", () => {
  test("second step register render correctly", () => {
    // @ts-ignore
    const wrapper = mount<SecondStepRegisterScreenImpl>(<SecondStepRegisterScreenImpl navigation={{}}/>)
    wrapper.render()

    expect(wrapper.find(SafeAreaView)).toExist()
    expect(wrapper.find(Screen)).toExist()
    expect(wrapper.find(AnimatedInteractiveInput)).toExist()
    expect(wrapper.find(FormRow)).toExist()
    expect(wrapper.find(Image)).toExist()
    expect(wrapper.find(KeyboardAccessoryView)).toExist()
  })

  test("first step register render correctly", () => {
    // @ts-ignore
    const wrapper = mount<FirstStepRegisterScreen>(<FirstStepRegisterScreen navigation={{}}/>)
    wrapper.render()

    expect(wrapper.find(SafeAreaView)).toExist()
    expect(wrapper.find(Screen)).toExist()
    expect(wrapper.find(AnimatedInteractiveInput)).toExist()
    expect(wrapper.find(FormRow)).toExist()
    expect(wrapper.find(Image)).toExist()
    expect(wrapper.find(KeyboardAccessoryView)).toExist()
  })
})
