import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { CachedImage, CachedImageType } from "./"
import { Api } from "@services/api"

const api = new Api();

storiesOf("CachedImage", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Cached Image" usage="Render cached image">
        <CachedImage
          uri={api.defaultAvatarUrl}
          type={CachedImageType.IMAGE}
          style={{width: 50, height: 50}}
          resizeMode="cover"
        />
      </UseCase>
      <UseCase text="Cached Background Image" usage="Render cached background image">
        <CachedImage
          uri={api.defaultCoverUrl}
          type={CachedImageType.IMAGE}
          style={{width: "100%", height: 100}}
          resizeMode="cover"
        />
      </UseCase>
    </Story>
  ))
