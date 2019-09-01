import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { observer } from "mobx-react"
import { action, observable } from "mobx"
import { AnimatedInteractiveInput, AnimatedInteractiveInputState } from "./"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Button } from "@components/button"

// tslint:disable completed-docs no-void-expression jsx-no-lambda

function getRandomState(): AnimatedInteractiveInputState {
// tslint:disable-next-line: insecure-random
  return Math.floor(Math.random() * Object.keys(AnimatedInteractiveInputState).length / 2)
}

@observer
class AnimatedInteractiveInputStory extends React.Component<any> {

  @observable private inputState: AnimatedInteractiveInputState

  @action.bound
  private onChangeText(): void {
    this.inputState = getRandomState()
  }

  public error(): void {
    this.inputState = AnimatedInteractiveInputState.ERROR
  }

  public loading(): void {
    this.inputState = AnimatedInteractiveInputState.LOADING
  }

  public render(): React.ReactNode {
    const { inputState, ...rest } = this.props

    const state = inputState ? inputState : this.inputState

    return (
      <AnimatedInteractiveInput
        {...rest}
        onChangeText={this.onChangeText}
        inputState={state}
        inputStyle={{ color: "black" }}
      />
    )
  }

  public success(): void {
    this.inputState = AnimatedInteractiveInputState.SUCCESS
  }
}

let successInputRef: AnimatedInteractiveInputStory
let errorInputRef: AnimatedInteractiveInputStory
let loadingInputRef: AnimatedInteractiveInputStory

storiesOf("AnimatedInteractiveInput", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Random animation", () => (
    <Story>
      <UseCase text="Random animation" usage="On typing it will get a random animation">
        <AnimatedInteractiveInputStory
          preset="auth"
          autoCapitalize="none"
        />
      </UseCase>
    </Story>
  ))
  .add("Success animation", () => (
    <Story>
      <UseCase text="success animation" usage="press button to show success animation">
        <Button text="press me" onPress={(): void => successInputRef.success()}/>
        <AnimatedInteractiveInputStory
          preset="auth"
          autoCapitalize="none"
          ref={(ref: AnimatedInteractiveInputStory): AnimatedInteractiveInputStory => successInputRef = ref}
        />
      </UseCase>
    </Story>
  ))
  .add("Loading animation", () => (
    <Story>
      <UseCase text="loading animation" usage="press button to show loading animation">
        <Button text="press me" onPress={(): void => loadingInputRef.loading()}/>
        <AnimatedInteractiveInputStory
          preset="auth"
          autoCapitalize="none"
          ref={(ref: AnimatedInteractiveInputStory): AnimatedInteractiveInputStory => loadingInputRef = ref}
        />
      </UseCase>
    </Story>
  ))
  .add("Error animation", () => (
    <Story>
      <UseCase text="error animation" usage="press button to show error animation">
        <Button text="press me" onPress={(): void => errorInputRef.error()}/>
        <AnimatedInteractiveInputStory
          preset="auth"
          autoCapitalize="none"
          ref={(ref: AnimatedInteractiveInputStory): AnimatedInteractiveInputStory => errorInputRef = ref}
        />
      </UseCase>
    </Story>
  ))
