import * as React from "react"
import { observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text } from "@components"
import { color, spacing } from "@theme"
import { NavigationParams, NavigationScreenProps } from "react-navigation"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { INotification, IPersonalToken, IPersonalTokens } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { IGroup } from "@models/group"
import autobind from "autobind-decorator"
import moment from "moment"
import { INotificationModel } from "@models/notification"
import { Notification } from "react-native-in-app-message"
import { AvatarLeftHeader } from "@navigation/components/avatar-left-header"
import { LogoHeader } from "@components/logo-header"
import { headerShadow } from "@utils/shadows"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { NavigationStackScreenProps } from "react-navigation-stack"
import { NavigationStackProp } from "react-navigation-stack/src/types"
import { AppScreens } from "@navigation/navigation-definitions"
import { IVoidFunction } from "@custom-types/functions"

export interface INotificationsScreenProps extends NavigationScreenProps<{}> {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

const NOTIFICATION_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  margin: spacing[3]
}

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right"
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const TEXT_ROW: ViewStyle = {
  ...ROW,
  flex: 1,
  marginTop: spacing[3],
  padding: spacing[2]
}

const keyExtractor = (item: INotificationModel, index: number): string => item.id

/**
 * NotificationsScreen when an user Is logged in, he will be redirected here.
 */
@inject(Injection.NotificationsModel)
@observer
export class NotificationsScreen extends React.Component<INotificationsScreenProps & InjectionProps> {

  private pictureToken: IPersonalToken

  private static goToPendingRequests(navigation: NavigationStackProp): IVoidFunction {
    return (): any => navigation.navigate(AppScreens.PENDING_REQUESTS, { me: true })
  }

  // tslint:disable-next-line: typedef
  public static navigationOptions = ({ navigation }) => ({
    headerLeft: AvatarLeftHeader,
    headerTitle: LogoHeader,
    headerStyle: {
      backgroundColor: color.backgroundDarkerer,
      borderBottomWidth: 0,
      ...headerShadow
    },
    headerRight: (
      <TouchableOpacity style={{marginRight: spacing[2]}} onPress={NotificationsScreen.goToPendingRequests(navigation)}>
        <FontawesomeIcon name="users-cog" size={32} color={color.palette.white} />
      </TouchableOpacity>
    )
  })

  @autobind
  // tslint:disable-next-line:prefer-function-over-method no-feature-envy
  private renderNotification({ item }: { item: INotificationModel }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL")
    const formattedUpdatedAt = moment(item.updated_at).format("LLL")

    return (
      <View
        style={NOTIFICATION_CONTAINER}
      >
        <View style={ROW}>
          <View style={{ marginLeft: spacing[2], justifyContent: "center" }}>
            <Text
              text={item.parseMessage}
              preset="userRow"
            />
          </View>
        </View>
        <View style={{ marginTop: spacing[3] }}>
          {/*<Text text={item.content} />*/}
        </View>
        <View style={TEXT_ROW}>
          <View>
            <Text preset="fieldLabel" tx="common.createdAt"/>
            <Text preset="fieldLabel" text={formattedCreatedAt}/>
          </View>
          <View style={{ alignSelf: "flex-end", flex: 1 }}>
            <Text preset="fieldLabel" tx="common.updatedAt" style={TEXT_ALIGN_RIGHT}/>
            <Text preset="fieldLabel" text={formattedUpdatedAt} style={TEXT_ALIGN_RIGHT}/>
          </View>
        </View>
      </View>
    )
  }

  public async componentDidMount(): Promise<void> {
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"]
  }

  public render(): React.ReactNode {
    return (
      <FlatList
        data={this.props.notificationsModel.notifications}
        // @ts-ignore
        renderItem={this.renderNotification}
        keyExtractor={keyExtractor}
        style={ROOT}
      />
    )
  }
}
