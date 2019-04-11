import * as React from "react"
import { ImageSourcePropType, ImageStyle, TouchableOpacity, ViewStyle } from "react-native"
import { inject, observer } from "mobx-react/native"
import { NavigationScreenProps } from "react-navigation"
import { action, observable } from "mobx"
import autobind from "autobind-decorator"
import { Avatar as RnpAvatar } from "react-native-paper"
import { IVoidFunction } from "@types"
import { spacing } from "@theme"
import { load } from "@utils/keychain"
import { load as loadFromStorage, StorageTypes } from "@utils/storage"
import { Server } from "@services/api/api.servers"
import { Injection } from "@services/injections"
import { Api, ApiRoutes, IPersonalTokens, IUser } from "@services/api"

export interface IAvatarProps {
  api?: Api
  disableOnPress?: boolean,
  onPress?: IVoidFunction,
  rootStyle?: ViewStyle,
  size?: number,
}

const ROOT: ViewStyle = {
  marginLeft: spacing[2]
}

const IMAGE: ImageStyle = {
  backgroundColor: "transparent"
}

export const defaultSize = 34
export const DefaultRnpAvatarSize = 64

/**
 * The avatar will be visible on the left of the header component.
 */
@inject(Injection.Api)
@observer
export class Avatar extends React.Component<IAvatarProps & Partial<NavigationScreenProps<any>>> {

  @observable private avatarUrl: string

  @autobind
  private openDrawer(): void {
    this.props.navigation.dangerouslyGetParent().openDrawer()
  }

  @action
  public async componentWillMount(): Promise<void> {
    const { api } = this.props
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    const userProfile: IUser = await loadFromStorage(StorageTypes.USER_PROFILE)
    const token = personalTokens && personalTokens["view-picture-exorun"].accessToken || ""

    this.avatarUrl =
      `${api.Url}/user/${userProfile.id}/${ApiRoutes.PROFILE_PICTURE_AVATAR}?token=${token}`
  }

  public render(): React.ReactNode {
    const { rootStyle, disableOnPress, onPress, size, navigation } = this.props
    const containerStyle = { ...ROOT, ...rootStyle }
    const touchable = disableOnPress
    const onTouchableOpacityPressed = navigation ? this.openDrawer : onPress
    const avatarSize = size ? size : defaultSize
    const avatarSource: ImageSourcePropType = {
      uri: this.avatarUrl
    }

    return (
      <TouchableOpacity
        onPress={onTouchableOpacityPressed}
        style={containerStyle}
        disabled={touchable}
      >
        <RnpAvatar.Image
          size={avatarSize}
          source={avatarSource}
          style={IMAGE}
        />
      </TouchableOpacity>
    )
  }
}
