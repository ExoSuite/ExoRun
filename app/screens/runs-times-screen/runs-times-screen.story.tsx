import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { UserRunsTimesScreen } from "./"
// tslint:disable-next-line:no-commented-code no-commented-out-code no-single-line-block-comment
/*import { Api } from "@services/api"*/

// tslint:disable-next-line:no-commented-code no-commented-out-code no-single-line-block-comment
/*const api = new Api();*/

// @ts-ignore
storiesOf("UserRunsTimesScreen", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <UserRunsTimesScreen/>
      </UseCase>
    </Story>
  ))
