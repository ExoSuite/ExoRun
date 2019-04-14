import * as React from "react"
import { ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { color, spacing } from "@theme"
import { DrawerItemsProps } from "react-navigation"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"
import { ProfileCover } from "@components/profile-cover"
import { AppScreens } from "@navigation/navigation-definitions"
import { IVoidFunction } from "@types"
import { Screen, Text } from "@components"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { observer } from "mobx-react/native"
import { IUser } from "@services/api"
import { action, observable } from "mobx"
import { load as loadFromStorage, StorageTypes } from "@utils/storage"
import { Build } from "@services/build-detector"

const buildVersionText = `version: ${Build.Version()}`

const ROOT: ViewStyle = {
  backgroundColor: color.background,
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

const TOUCHABLE: ViewStyle = {
  padding: spacing[4],
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%"
}

const NICK_NAME: TextStyle = {
  textAlign: "center",
  fontSize: 16
}

const PROFILE_CONTAINER: ViewStyle = {
  padding: spacing[2],
  width: "100%"
}

/**
 * The DrawerNavigation will be visible when someone swipe to the left or tap on the avatar-left-header.tsx
 */
@observer
export class DrawerNavigation extends React.Component<DrawerItemsProps> {

  @observable
  private userProfile: IUser = {} as IUser

  private readonly navigateToScreen = (screen: AppScreens): IVoidFunction => (
    (): void => {
      this.props.navigation.navigate(screen)
    }
  )

  @action
  public async componentWillMount(): Promise<void> {
    this.userProfile = await loadFromStorage(StorageTypes.USER_PROFILE)
  }

  public render(): React.ReactNode {

    return (
      // @ts-ignore
      <View style={ROOT} preset="fixed">
        <View style={HEADER_CONTAINER}>
          <ProfileCover
            style={BACKGROUND_IMAGE}
          >
            <Avatar
              rootStyle={{ marginLeft: 0, marginBottom: spacing[2] }}
              size={DefaultRnpAvatarSize}
              onPress={this.navigateToScreen(AppScreens.PERSONAL_PROFILE)}
            />
          </ProfileCover>
        </View>
        <Screen preset="fixed">
          <View style={PROFILE_CONTAINER}>
            <Text preset="headerCentered" text={`${this.userProfile.first_name} ${this.userProfile.last_name}`}/>
            <Text preset="fieldLabelLight" text={this.userProfile.nick_name} style={NICK_NAME}/>
          </View>

          <TouchableOpacity
            style={TOUCHABLE}
            onPress={this.navigateToScreen(AppScreens.PERSONAL_PROFILE)}
          >
            <FontawesomeIcon
              name="user-circle"
              color="white"
              size={30}
            />
            <Text tx="drawer.my-profile" preset="header"/>
          </TouchableOpacity>
          <TouchableOpacity
            style={TOUCHABLE}
            onPress={this.navigateToScreen(AppScreens.APP_SETTINGS)}
          >
            <FontawesomeIcon
              name="cogs"
              color="white"
              size={30}
            />
            <Text tx="drawer.app-settings"  preset="header"/>
          </TouchableOpacity>
        </Screen>
        <Text preset="bold" text={buildVersionText} style={{textAlign: "center"}}/>
      </View>
    )
  }
}
