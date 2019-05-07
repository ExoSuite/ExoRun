/**
 * @jest-environment jsdom
 */
import * as React from "react"
import { mount, shallow } from "enzyme"
import { UserProfileScreenImpl, UserProfileScreen } from "@screens/user-profile-screen"
import { spy } from "sinon"
import { Api } from "@services/api"
import { Provider } from "mobx-react/native"
import { CachedImage } from "@components/cached-image"
import { Animated, Text, View } from "react-native"

spy(UserProfileScreenImpl.prototype, "componentDidMount")

describe("user profile tests", () => {

  test("mount call componentDidMount", () => {
    mount<UserProfileScreenImpl>((
      // @ts-ignore
      <UserProfileScreenImpl api={new Api()} navigation={{getParam: (): boolean => true}}/>
    ))

    expect(UserProfileScreenImpl.prototype.componentDidMount).toHaveProperty("callCount", 1)
  })

  test("render correctly", () => {
    const api: Api = new Api()

    const wrapper = mount<UserProfileScreenImpl>(
      React.createElement(
        (props: any) => (
          <Provider api={api}>
            <UserProfileScreen navigation={{getParam: (): boolean => true}}/>
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
