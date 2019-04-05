import * as React from "react"
import { ImageBackground, ImageSourcePropType, ImageStyle, View, ViewStyle } from "react-native"
import { color, spacing } from "@theme"
import { DrawerItemsProps } from "react-navigation"
import { observer } from "mobx-react/native"
import { action, observable } from "mobx"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"

const ROOT: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  flex: 1
}

const HEADER_CONTAINER: ViewStyle = {
  height: 200
}

const BACKGROUND_IMAGE: ImageStyle = {
  flex: 1,
  justifyContent: "flex-end",
  alignItems: "center"
}

/**
 * The DrawerNavigation will be visible when someone swipe to the left or tap on the avatar-left-header.tsx
 */
@observer
export class DrawerNavigation extends React.Component<DrawerItemsProps> {

  @observable private pictureCoverUrl: string

  @action
  public async componentWillMount(): Promise<void> {
    this.pictureCoverUrl = "https://coinrevolution.com/wp-content/uploads/2018/04/blockchain-red-thunder-lightning-network_0.png"
  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {

    const imageBackgroundSource: ImageSourcePropType = {
      uri: this.pictureCoverUrl
    }

    return (
      <View style={ROOT}>
        <View style={HEADER_CONTAINER}>
          <ImageBackground
            source={imageBackgroundSource}
            style={BACKGROUND_IMAGE}
            resizeMode="cover"
          >
            <Avatar
              rootStyle={{ marginLeft: 0, marginBottom: spacing[2] }}
              size={DefaultRnpAvatarSize}
            />
          </ImageBackground>
        </View>
      </View>
    )
  }
}
