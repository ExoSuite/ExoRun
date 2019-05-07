import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { Story, StoryScreen, UseCase } from "../../../storybook/views"
import { TouchableGreyscaledIcon } from "./"
import { CachedImage, CachedImageType } from "@components/cached-image"
import { Avatar, defaultSize } from "@components/avatar"

// tslint:disable: jsx-no-lambda

storiesOf("TouchableGreyscaledIcon", module)
  .addDecorator((fn: Function) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Demonstration", () => (
    <Story>
      <UseCase text="for background image" usage="use it for background image">
        <TouchableGreyscaledIcon iconName="camera" iconSize={32} onPress={(): void => null}>
          <CachedImage
            type={CachedImageType.BACKGROUND_IMAGE}
            uri="https://images.pexels.com/photos/1546901/pexels-photo-1546901.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            style={{ width: "100%", height: 150 }}
            resizeMode="cover"
          />
        </TouchableGreyscaledIcon>
      </UseCase>
      <UseCase text="for avatar image" usage="use it with avatar" style={{height: 50}}>
        <TouchableGreyscaledIcon iconName="camera" iconSize={21} fullScreen={false} size={defaultSize} onPress={(): void => null}>
          <Avatar urlFromParent avatarUrl="https://api.adorable.io/avatars/285/abott@adorable.png" withMargin={false}/>
        </TouchableGreyscaledIcon>
      </UseCase>
    </Story>
  ))
