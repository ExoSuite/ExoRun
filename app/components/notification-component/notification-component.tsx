import React from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { inject, observer } from "mobx-react"
import { Injection, InjectionProps } from "@services/injections"
import { INotificationModel } from "@models/notification"
import { isEmpty } from "lodash-es"
import { IPersonalToken, IPersonalTokens } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { spacing } from "@theme/spacing"
import { Avatar } from "@components/avatar"
import { IVoidFunction } from "@custom-types/functions"
import { action, observable } from "mobx"

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  padding: spacing[2]
}

/**
 * NotificationComponentManager will handle fill / reset of data
 */
export class NotificationComponentManager {
  public static FillNotification: IVoidFunction
  public static ResetNotification: IVoidFunction
}

/**
 * NotificationComponent will show the data from a notification
 */
@inject(Injection.Api)
@observer
export class NotificationComponent extends React.Component<InjectionProps> {
  private pictureToken: IPersonalToken

  @observable public notification: INotificationModel = null

  constructor(props: any) {
    super(props)

    NotificationComponentManager.FillNotification = this.fillNotification
    NotificationComponentManager.ResetNotification = this.resetNotification
  }

  @action.bound
  private fillNotification(notification: INotificationModel): void {
    this.notification = notification
  }

  @action.bound
  private resetNotification(): void {
    this.notification = null
  }

  public async componentDidMount(): Promise<void> {
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"]
  }

  public render(): React.ReactNode {
    const { api } = this.props

    if (isEmpty(this.notification)) {
      return null
    }

    return (
      <View style={ROOT}>
        <View style={{flex: 0.20, paddingTop: spacing[2]}}>
          <Avatar
            urlFromParent
            size={52}
            avatarUrl={api.buildAvatarUrl(this.notification.authorUserId, this.pictureToken.accessToken)}
          />
        </View>
        <View style={{paddingTop: spacing[2], paddingLeft: spacing[2], paddingRight: spacing[2], flex: 0.80}}>
          <Text text={this.notification.parseMessage} preset="bold"/>
        </View>
      </View>
    )
  }
}
