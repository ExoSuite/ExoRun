import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import { TextStyle, ViewStyle, Alert } from "react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { Button } from "./"

const buttonStyleArray: ViewStyle[] = [
  { paddingVertical: 100 },
  { borderRadius: 0 }
]

const buttonTextStyleArray: TextStyle[] = [
  { fontSize: 20 },
  { color: "#a511dc" }
]

const alert = (): void => {
  Alert.alert("pressed")
}

storiesOf("Button", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", (): React.ReactNode => (
    <Story>
      <UseCase text="Primary" usage="The primary button.">
        <Button text="Click It" preset="primary" onPress={alert}/>
      </UseCase>
      <UseCase text="Disabled" usage="The disabled behaviour of the primary button.">
        <Button text="Click It" preset="primary" onPress={alert} disabled/>
      </UseCase>
      <UseCase text="Array Style" usage="Button with array style">
        <Button
          text="Click It"
          preset="primary"
          onPress={alert}
          style={buttonStyleArray}
          textStyle={buttonTextStyleArray}
        />
      </UseCase>
    </Story>
  ))
