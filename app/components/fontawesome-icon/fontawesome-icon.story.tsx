import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { FontawesomeIcon } from "./"

// tslint:disable typedef

storiesOf("FontawesomeIcon")
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Example", () => (
    <Story>
      <UseCase text="Light" usage="Chevron left light">
        <FontawesomeIcon name="chevron-left" type="light" size={30}/>
      </UseCase>

      <UseCase text="Solid" usage="Chevron left solid">
        <FontawesomeIcon name="chevron-left" type="solid" size={30}/>
      </UseCase>

      <UseCase text="Regular" usage="Chevron left regular">
        <FontawesomeIcon name="chevron-left" type="regular" size={30}/>
      </UseCase>

      <UseCase text="Brand" usage="For print a brand">
        <FontawesomeIcon name="bitbucket" type="brand" size={30}/>
      </UseCase>
    </Story>
  ))
