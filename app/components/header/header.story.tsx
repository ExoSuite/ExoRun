import * as React from "react"
import { View } from "react-native"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Header } from "./header"
import { color } from "@theme"

const VIEWSTYLE = {
  flex: 1,
  backgroundColor: color.storybookDarkBg
}

storiesOf("Header")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Behavior", () => (
    <Story>
      <UseCase noPad text="default" usage="The default usage">
        <View style={VIEWSTYLE}>
          <Header
            headerTx="secondExampleScreen.howTo"
          />
        </View>
      </UseCase>
      <UseCase noPad text="leftIcon" usage="A left nav icon">
        <View style={VIEWSTYLE}>
          <Header
            headerTx="secondExampleScreen.howTo"
            leftIcon="head-vr"
            leftIconType="solid"
            leftIconSize={30}
            onLeftPress={() => window.alert("left nav")}
          />
        </View>
      </UseCase>
      <UseCase noPad text="rightIcon" usage="A right nav icon">
        <View style={VIEWSTYLE}>
          <Header
            headerTx="secondExampleScreen.howTo"
            rightIcon="head-vr"
            rightIconType="solid"
            rightIconSize={30}
            onRightPress={() => window.alert("right nav")}
          />
        </View>
      </UseCase>
    </Story>
  ))
