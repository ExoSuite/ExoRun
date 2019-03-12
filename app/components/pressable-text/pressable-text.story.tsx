import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { PressableText } from "./"

storiesOf("PressableText", module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="PressableText" usage="PressableText">
        <PressableText text="PressableText" preset="bold"
                       onPress={() => console.tron.log("PressableText PRESSED!")}
                       style={{color: "black"}}
        />
      </UseCase>
    </Story>
  ))
