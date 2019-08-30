import * as React from "react"
import { observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { INotification, IPersonalToken, IPersonalTokens } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { IGroup } from "@models/group"
import autobind from "autobind-decorator"
import moment from "moment"

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
  margin: spacing[3],
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

const keyExtractor = (item: INotification, index: number): string => item.id

/**
 * NotificationsScreen when an user Is logged in, he will be redirected here.
 */
@inject(Injection.NotificationsModel)
@observer
export class NotificationsScreen extends React.Component<INotificationsScreenProps & InjectionProps> {

  private pictureToken: IPersonalToken

  @autobind
  // tslint:disable-next-line:prefer-function-over-method no-feature-envy
  private renderNotification({ item }: { item: INotification }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL")
    const formattedUpdatedAt = moment(item.updated_at).format("LLL")

    return (
      <View
        style={NOTIFICATION_CONTAINER}
      >
        <View style={ROW}>
          <View style={{ marginLeft: spacing[2], justifyContent: "center" }}>
            <Text
              style={{ textTransform: "capitalize" }}
              text="coucou"
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
        renderItem={this.renderNotification}
        keyExtractor={keyExtractor}
        style={ROOT}
      />
    )
  }
}
