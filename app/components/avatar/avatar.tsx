import * as React from "react"
import { ImageStyle, TouchableOpacity, ViewStyle } from "react-native"
import { inject, observer } from "mobx-react/native"
import { NavigationScreenProps } from "react-navigation"
import { action, observable } from "mobx"
import autobind from "autobind-decorator"
import { IVoidFunction } from "@types"
import { spacing } from "@theme"
import { load } from "@utils/keychain"
import { load as loadFromStorage, StorageTypes } from "@utils/storage"
import { Server } from "@services/api/api.servers"
import { Injection, InjectionProps } from "@services/injections"
import { ApiRoutes, IPersonalTokens, IUser } from "@services/api"
import { Build } from "@services/build-detector"
import { AvatarImageReactNativePaper } from "@components/avatar/avatar-image-react-native-paper"

export interface IAvatarProps extends InjectionProps {
  avatarUrl?: string
  cache?: boolean
  disableOnPress?: boolean
  onPress?: IVoidFunction
  rootStyle?: ViewStyle
  size?: number
  urlFromParent: boolean
  withMargin?: boolean
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
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    if (this.props.urlFromParent) {
      return
    }

    if (Build.RunningOnStoryBook()) {
      this.avatarUrl = api.defaultAvatarUrl
    } else {
      const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
      const userProfile: IUser = await loadFromStorage(StorageTypes.USER_PROFILE)
      const token = personalTokens && personalTokens["view-picture-exorun"].accessToken || ""

      this.avatarUrl =
        `${api.Url}/user/${userProfile.id}/${ApiRoutes.PROFILE_PICTURE_AVATAR}?token=${token}`
    }
  }

  private get getAvatarUrl(): string {
    return this.avatarUrl || this.props.avatarUrl || this.props.api.defaultAvatarUrl
  }

  public render(): React.ReactNode {
    const { rootStyle, disableOnPress, onPress, size, navigation, withMargin = true, cache } = this.props
    const containerStyle: ViewStyle = { ...ROOT, ...rootStyle }
    const touchable = disableOnPress
    const onTouchableOpacityPressed = navigation ? this.openDrawer : onPress
    const avatarSize = size ? size : defaultSize

    if (!withMargin) {
      containerStyle.marginLeft = 0
    }

    return (
      <TouchableOpacity
        onPress={onTouchableOpacityPressed}
        style={containerStyle}
        disabled={touchable}
      >
        <AvatarImageReactNativePaper
          size={avatarSize}
          uri={this.getAvatarUrl}
          style={IMAGE}
          cache={cache}
        />
      </TouchableOpacity>
    )
  }
}
