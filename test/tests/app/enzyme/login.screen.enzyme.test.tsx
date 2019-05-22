/**
 * @jest-environment jsdom
 */
import * as React from "react"
import { mount } from "enzyme"
import { LoginScreen } from "@screens/auth"
import { Image, SafeAreaView } from "react-native"
import { Screen } from "@components/screen"
import { AnimatedInteractiveInput } from "@components/animated-interactive-input"
import { FormRow } from "@components/form-row"
import { KeyboardAccessoryView } from "react-native-keyboard-accessory"
import { Provider } from "mobx-react/native"
import { Api } from "@services/api"
import { SoundPlayer } from "@services/sound-player"
import { UserModelMock } from "../../../__mocks__/stores/UserModelMock"
import { GroupsModelMockData } from "../../../__mocks__/stores/GroupsModelMock"

describe("login tests", () => {
  const api: Api = new Api()
  const soundPlayer = new SoundPlayer()

  test("login render correctly", () => {
    const wrapper = mount<LoginScreen>((
      <Provider api={api} soundPlayer={soundPlayer} userModel={UserModelMock} groupsModel={GroupsModelMockData}>
        <LoginScreen
          // @ts-ignore
          navigation={{ goBack: (): boolean => true, getParam: (): object => ({}) }}
        />
      </Provider>
    ))
    wrapper.render()
    expect(wrapper.find(SafeAreaView)).toExist()
    expect(wrapper.find(Screen)).toExist()
    expect(wrapper.find(AnimatedInteractiveInput)).toExist()
    expect(wrapper.find(FormRow)).toExist()
    expect(wrapper.find(Image)).toExist()
    expect(wrapper.find(KeyboardAccessoryView)).toExist()
  })

})
