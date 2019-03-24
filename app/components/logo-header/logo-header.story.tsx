import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { LogoHeader } from "./"

storiesOf("LogoHeader", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <LogoHeader/>
      </UseCase>
    </Story>
  ))
