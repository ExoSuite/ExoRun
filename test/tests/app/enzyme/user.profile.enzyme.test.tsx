/**
 * @jest-environment jsdom
 */
import * as React from "react"
import { mount } from "enzyme"
import { UserProfileScreen, UserProfileScreenImpl } from "@screens/user-profile-screen"
import { Api } from "@services/api"
import { CachedImage } from "@components/cached-image"
import { Animated, Text, View } from "react-native"
import { Provider } from "mobx-react/native"
import { UserModelMock } from "../../../__mocks__/stores/UserModelMock"

describe("user profile tests", () => {

  test("render correctly", () => {
    const api: Api = new Api()

    const wrapper = mount<UserProfileScreenImpl>(
      React.createElement(
        (props: any) => (
          <Provider api={api} userModel={UserModelMock}>
            <UserProfileScreen
              // @ts-ignore
              navigation={{getParam: (): boolean => true}}
            />
          </Provider>
        )
      )
    )

    expect(wrapper).not.toBeEmptyRender()
    expect(wrapper.find(CachedImage)).toExist()
    expect(wrapper.find(Animated.View)).toExist()
    expect(wrapper.find(Animated.ScrollView)).toExist()
    expect(wrapper.find(Text)).toExist()
    expect(wrapper.find(View)).toExist()

  })

})
