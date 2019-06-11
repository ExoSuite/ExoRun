import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { UserRow } from "./"
import { Api } from "@services/api"

const api = new Api();

storiesOf("UserRow", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <UserRow
          firstName="Jean"
          nickName="Eddy mitchell"
          lastName="Michel"
          avatarUrl={api.defaultAvatarUrl}
        />
      </UseCase>
    </Story>
  ))
