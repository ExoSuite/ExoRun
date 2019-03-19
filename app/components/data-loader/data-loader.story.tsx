import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { DataLoader, defaultErrorCallback, defaultSuccessCallback } from "./"
import { Button } from "@components"
import { SoundPlayer } from "@services/sound-player"

/* tslint:disable */

let refSuccess: DataLoader
let refError: DataLoader

const soundPlayer = new SoundPlayer()
if (process.env.JEST_WORKER_ID === undefined) {
  soundPlayer.setup()
} else {
  soundPlayer.setupForTests()
}

const errors = {
  "email": [
    "The email field is required."
  ],
  "password": [
    "The password field is required."
  ]
}

storiesOf("Animated Data Loader")
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Success", () =>
    (
      <Story>
        <UseCase text="Success" usage="Start the success animation">
          <Button text="click to success" onPress={() => refSuccess.toggleIsVisible()}/>
        </UseCase>

        <DataLoader
          ref={(loader: DataLoader) => {
            refSuccess = loader
          }}
        >
          <Button
            text="click to show success animation"
            preset="success"
            onPress={() => {
              refSuccess.success(
                () => soundPlayer.success(),
                defaultSuccessCallback
              )
            }}
          />
        </DataLoader>
      </Story>
    )
  )
  .add("Error", () =>
    (
      <Story>
        <UseCase text="Failed" usage="Start the error animation">
          <Button text="click to error" onPress={() => refError.toggleIsVisible()}/>
        </UseCase>
        <DataLoader ref={(loader: DataLoader) => refError = loader}>
          <Button
            text="click to animate"
            preset="error"
            onPress={() =>
              refError.hasErrors(
                errors,
                () => soundPlayer.error(),
                defaultErrorCallback
              )
            }
          />
        </DataLoader>
      </Story>
    )
  )
