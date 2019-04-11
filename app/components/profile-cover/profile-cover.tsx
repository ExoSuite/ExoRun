import * as React from "react"
import { ImageBackground, ImageSourcePropType, ImageStyle } from "react-native"
import { action, observable } from "mobx"
import { inject, observer } from "mobx-react/native"
import { Api, ApiRoutes, IPersonalTokens, IUser } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { load as loadFromStorage, StorageTypes } from "@utils/storage"
import { Injection } from "@services/injections"

export interface IProfileCoverProps {
  api?: Api
  children?: any,
  style: ImageStyle,
}

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
@inject(Injection.Api)
@observer
export class ProfileCover extends React.Component<IProfileCoverProps> {

  @observable private pictureCoverUrl: string

  @action
  public async componentWillMount(): Promise<void> {
    const { api } = this.props
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    const userProfile: IUser = await loadFromStorage(StorageTypes.USER_PROFILE)
    const token = personalTokens && personalTokens["view-picture-exorun"].accessToken || ""

    this.pictureCoverUrl =
      `${api.Url}/user/${userProfile.id}/${ApiRoutes.PROFILE_PICTURE_COVER}?token=${token}`
  }

  public render(): React.ReactNode {
    // grab the props
    const { children, style } = this.props
    const coverSource: ImageSourcePropType = {
      uri: this.pictureCoverUrl
    }

    return (
      <ImageBackground
        style={style}
        source={coverSource}
        resizeMode="cover"
      >
        {children}
      </ImageBackground>
    )
  }
}
