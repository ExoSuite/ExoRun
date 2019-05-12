import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { ProfileCover } from "./"
import { ImageStyle } from "react-native"

const BACKGROUND_IMAGE: ImageStyle = {
  flex: 1,
  justifyContent: "flex-end",
  alignItems: "center",
  minHeight: 150
}

storiesOf("ProfileCover", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Profile cover" usage="render the profile cover.">
        <ProfileCover style={BACKGROUND_IMAGE}/>
      </UseCase>
    </Story>
  ))
