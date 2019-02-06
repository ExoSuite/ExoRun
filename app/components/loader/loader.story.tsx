import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { defaultErrorCallback, defaultSuccessCallback, Loader } from "./"
import { Button } from "@components"
import { SoundPlayer } from "@services/sound-player"

let refSuccess: Loader
let refError: Loader

const soundPlayer = new SoundPlayer()
if (typeof __TEST__ === "undefined" || !__TEST__)
  soundPlayer.setup()
else
  soundPlayer.setupForTests()

const errors = {
  "email": [
    "The email field is required."
  ],
  "password": [
    "The password field is required."
  ]
}

storiesOf("Loader")
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add("Success animation", () =>
    <Story>
      <UseCase text="Success" usage="Start the success animation">
        <Button text="click to success" onPress={() => refSuccess.toggleIsVisible()}/>
      </UseCase>

      <Loader ref={(loader: Loader) => refSuccess = loader}>
        <Button
          text="click to show success animation"
          preset="success"
          onPress={() => refSuccess.success(
            defaultSuccessCallback,
            () => soundPlayer.success()
          )}
        />
      </Loader>
    </Story>
  )
  .add("Error animation", () =>
    <Story>
      <UseCase text="Failed" usage="Start the error animation">
        <Button text="click to error" onPress={() => refError.toggleIsVisible()}/>
      </UseCase>
      <Loader ref={(loader: Loader) => refError = loader}>
        <Button text="click to animate" preset="error" onPress={() =>
          refError.hasErrors(
            errors,
            defaultErrorCallback,
            () => soundPlayer.error()
          )
        }/>
      </Loader>
    </Story>)
