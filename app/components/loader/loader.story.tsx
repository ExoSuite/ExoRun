import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { Loader } from "./"
import { Button } from "@components"

let ref: Loader;

storiesOf("Loader")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Playground", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <Button text="Click for reveal loader" onPress={() => ref.toggleIsVisible()}/>
        <Loader ref={(loader: Loader) => {ref = loader}}>
          <Button text="click to success" onPress={() => ref.success()}/>
        </Loader>
      </UseCase>
    </Story>
  ))
