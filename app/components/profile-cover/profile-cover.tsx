import * as React from "react"
import { ImageStyle } from "react-native"
import { action, observable } from "mobx"
import { inject, observer } from "mobx-react/native"
import { ApiRoutes, IPersonalTokens, IUser } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { load as loadFromStorage, StorageTypes } from "@utils/storage"
import { Injection, InjectionProps } from "@services/injections"
import { Build } from "@services/build-detector"
import { CachedImage, CachedImageType } from "@components/cached-image/cached-image"

export interface IProfileCoverProps extends InjectionProps {
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
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    if (Build.RunningOnStoryBook()) {
      this.pictureCoverUrl = api.defaultCoverUrl
    } else {
      const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
      const userProfile: IUser = await loadFromStorage(StorageTypes.USER_PROFILE)
      const token = personalTokens && personalTokens["view-picture-exorun"].accessToken || ""

      this.pictureCoverUrl =
        `${api.Url}/user/${userProfile.id}/${ApiRoutes.PROFILE_PICTURE_COVER}?token=${token}`
    }
  }

  private get getPictureCoverUrl(): string {
    return this.pictureCoverUrl || this.props.api.defaultCoverUrl
  }

  public render(): React.ReactNode {
    // grab the props
    const { children, style } = this.props

    return (
      <CachedImage
        style={style}
        uri={this.getPictureCoverUrl}
        resizeMode="cover"
        type={CachedImageType.BACKGROUND_IMAGE}
      >
        {children}
      </CachedImage>
    )
  }
}
