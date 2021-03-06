import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { DataLoader, defaultErrorCallback, defaultSuccessCallback } from "./"
import { Button } from "@components/button"
import { SoundPlayer } from "@services/sound-player"
import { noop } from "lodash-es"

/* tslint:disable */

let refSuccess: DataLoader
let refError: DataLoader

const soundPlayer = new SoundPlayer()
if (process.env.JEST_WORKER_ID === undefined) {
  soundPlayer.setup()
} else {
  // @ts-ignore
  soundPlayer.setupForTests(noop, noop, noop, noop)
}

const errors = {
  "email": [
    "The email field Is required."
  ],
  "password": [
    "The password field Is required."
  ]
}

storiesOf("Animated Data Loader", module)
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
                () => soundPlayer.playSuccess(),
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
                () => soundPlayer.playError(),
                defaultErrorCallback
              )
            }
          />
        </DataLoader>
      </Story>
    )
  )
