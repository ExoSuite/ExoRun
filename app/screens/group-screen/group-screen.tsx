import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { RightNavigationButton } from "@navigation/components/right-navigation-button"
import { AppScreens } from "@navigation/navigation-definitions"
import { Injection, InjectionProps } from "@services/injections"
import autobind from "autobind-decorator"
import { IGroup, IPersonalToken, IPersonalTokens } from "@services/api"
import moment from "moment"
import { IBoolFunction } from "@types"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"

export interface IGroupScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1
}

const GROUP_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  margin: spacing[2],
  padding: spacing[2]
}

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right"
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const SEARCH: ViewStyle = {
  backgroundColor: color.backgroundDarkerer
}

const HeaderRight = RightNavigationButton({ modalScreen: AppScreens.NEW_GROUP })
const keyExtractor = (item: IGroup, index: number): string => item.id

// tslint:disable-next-line: completed-docs
@inject(Injection.GroupsModel)
@observer
export class GroupScreen extends React.Component<IGroupScreenProps> {

  private pictureToken: IPersonalToken

  public static navigationOptions = {
    headerRight: <HeaderRight/>
  }

  @autobind
  private onGroupPressNavigateToChat(group: IGroup): IBoolFunction {
    return (): boolean => this.props.navigation.navigate(
      AppScreens.CHAT,
      {
        group,
        pictureToken: this.pictureToken
      })
  }

  // tslint:disable-next-line: no-feature-envy
  @autobind
  private renderGroup({item}: { item: IGroup}): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL")
    const formattedUpdatedAt = moment(item.updated_at).format("LLL")

    return (
      <TouchableOpacity
        style={GROUP_CONTAINER}
        onPress={this.onGroupPressNavigateToChat(item)}
        //        onLongPress={this.onUserWantToUpdatePost(item)}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{ textTransform: "capitalize" }}
              text={item.name}
              preset="userRow"
            />
          </View>
        </View>
        <View style={{marginTop: spacing[3]}}>
          {/*<Text text={item.content} />*/}
        </View>
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View>
            <Text preset="fieldLabel" tx="common.createdAt"/>
            <Text preset="fieldLabel" text={formattedCreatedAt}/>
          </View>
          <View style={{alignSelf: "flex-end", flex: 1}}>
            <Text preset="fieldLabel" tx="common.updatedAt" style={TEXT_ALIGN_RIGHT}/>
            <Text preset="fieldLabel" text={formattedUpdatedAt} style={TEXT_ALIGN_RIGHT}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  public async componentDidMount(): Promise<void> {
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"]
  }

  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixed">
        <FlatList
          data={this.props.groupsModel.latest}
          renderItem={this.renderGroup}
          keyExtractor={keyExtractor}
        />
      </Screen>
    )
  }
}
