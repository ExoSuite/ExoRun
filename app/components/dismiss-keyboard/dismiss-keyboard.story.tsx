import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { DismissKeyboard } from "./"
import { TextField } from "@components/text-field"

// tslint:disable typedef

storiesOf("DismissKeyboard", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="DismissKeyboard" usage="Click on input and click in the screen to dissmiss">
        <DismissKeyboard>
          <TextField/>
        </DismissKeyboard>
      </UseCase>
    </Story>
  ))
