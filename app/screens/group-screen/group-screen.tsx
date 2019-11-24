import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "@components"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { RightNavigationButton } from "@navigation/components/right-navigation-button"
import { AppScreens } from "@navigation/navigation-definitions"
import { Injection, InjectionProps } from "@services/injections"
import autobind from "autobind-decorator"
import { Api, IPersonalToken, IPersonalTokens } from "@services/api"
import moment from "moment"
import { IBoolFunction } from "@custom-types"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { IGroup } from "@models/group"
import { GroupSwipeableRow } from "@screens/group-screen/components/group-swipeable-row"
import { noop } from "lodash-es"
import { action } from "mobx"

export interface IGroupScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

const GROUP_CONTAINER: ViewStyle = {
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

const TOUCHABLE_GROUP_CONTAINER: ViewStyle = {
  backgroundColor: GROUP_CONTAINER.backgroundColor
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

const SEARCH: ViewStyle = {
  backgroundColor: color.backgroundDarkerer
}

const HeaderRight = RightNavigationButton({ modalScreen: AppScreens.NEW_GROUP })
const keyExtractor = (item: IGroup, index: number): string => item.id

/**
 * GroupScreen will show the groups
 */
@inject(Injection.GroupsModel, Injection.Api)
@observer
export class GroupScreen extends React.Component<IGroupScreenProps> {
  private groupToken: IPersonalToken
  private onEndReachedCalledDuringMomentum = true
  private pictureToken: IPersonalToken

  public static navigationOptions = {
    headerRight: <HeaderRight/>
  }

  @autobind
  private async deleteGroup(group: IGroup): Promise<void> {
    const { api } = this.props

    await api.delete(`group/${group.id}`, {}, Api.BuildAuthorizationHeader(this.groupToken)).catch(noop)
    this.props.groupsModel.deleteGroup(group)
  }

  @autobind
  private onEndReached(): void {
    const { groupsModel } = this.props

    if (groupsModel.currentPage < groupsModel.maxPage && !this.onEndReachedCalledDuringMomentum) {
      this.onUserTypeToSearch().catch(noop)
    }
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

  @autobind
  private onMomentumScrollBegin(): void {
    this.onEndReachedCalledDuringMomentum = false
  }

  @action.bound
  // tslint:disable-next-line: typedef
  private async onUserTypeToSearch(): Promise<void> {
    const { groupsModel } = this.props

    // tslint:disable-next-line: restrict-plus-operands
    groupsModel.fetchGroups(groupsModel.currentPage + 1)
  }

  // tslint:disable-next-line: no-feature-envy
  @autobind
  private renderGroup({ item }: { item: IGroup }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL")
    const formattedUpdatedAt = moment(item.updated_at).format("LLL")

    // @ts-ignore
    const onDeleteGroup = (): void => this.deleteGroup(item)

    return (
      <GroupSwipeableRow style={GROUP_CONTAINER} onDeleteGroup={onDeleteGroup}>
        <TouchableOpacity
          style={TOUCHABLE_GROUP_CONTAINER}
          onPress={this.onGroupPressNavigateToChat(item)}
        >
          <View style={ROW}>
            <View style={{ marginLeft: spacing[2], justifyContent: "center" }}>
              <Text
                style={{ textTransform: "capitalize" }}
                text={item.name}
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
        </TouchableOpacity>
      </GroupSwipeableRow>
    )
  }

  public async componentDidMount(): Promise<void> {
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"]
    this.groupToken = personalTokens["group-exorun"]
  }

  public render(): React.ReactNode {

    return (
      <FlatList
        data={this.props.groupsModel.latest}
        renderItem={this.renderGroup}
        keyExtractor={keyExtractor}
        style={ROOT}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
      />
    )
  }
}
