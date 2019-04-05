import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { PressableText } from "./"

const onPress = (): void => {
  console.tron.log("PressableText PRESSED!")
}

storiesOf("PressableText", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="PressableText" usage="PressableText">
        <PressableText
          text="PressableText"
          preset="bold"
          onPress={onPress}
          style={{ color: "black" }}
        />
      </UseCase>
    </Story>
  ))
