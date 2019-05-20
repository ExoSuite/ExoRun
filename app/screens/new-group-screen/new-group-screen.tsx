import * as React from "react"
import { observer } from "mobx-react"
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { TextField } from "@components/text-field"
import InputScrollView from "react-native-input-scroll-view"
import { action, observable } from "mobx"
import { Api, IPersonalTokenResponse, IPersonalTokens, IUser } from "@services/api"
import { Button } from "@components/button"
import autobind from "autobind-decorator"
import { AppScreens } from "@navigation/navigation-definitions"
import { UserRow } from "@components/user-row"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { Injection, InjectionProps } from "@services/injections"
import { inject } from "mobx-react/native"
import { renderIf } from "@utils/render-if"
import { isEmpty } from "lodash-es"

export interface INewGroupScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  padding: spacing[6]
}

const BOTTOM_BORDER: ViewStyle = {
  borderBottomColor: color.palette.lighterGrey,
  borderBottomWidth: 0.5
}

const INPUT_STYLE: ViewStyle = {
  backgroundColor: color.transparent
}

const MARGIN_TOP: ViewStyle = {
  marginTop: spacing[3],
}

const NEW_GROUP_SEND_BUTTON: ViewStyle = {
  ...MARGIN_TOP,
  marginBottom: spacing[8]
}

const USER_LIST_CONTAINER: ViewStyle = {
  marginBottom: spacing[6],
  marginTop: spacing[3]
}

const keyExtractor = (item: IUser, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api, Injection.GroupsModel)
@observer
export class NewGroupScreen extends React.Component<INewGroupScreenProps> {
  private groupToken: IPersonalTokenResponse
  @observable private pictureToken: string
  @observable private users: IUser[] = []
  @observable public newGroupName: string

  public static navigationOptions = {
    headerTitle: <Text tx="common.new-group" preset="header"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down"
    })
  }

  @autobind
  private openChooseUserModal(): void {
    if (this.users.length > 0) {
      this.openChooseUserModalWithChosenUsers()
    } else {
      const { navigation } = this.props
      navigation.navigate(AppScreens.CHOOSE_USERS_FOR_NEW_GROUP, { updateUsers: this.updateUsers })
    }
  }

  @autobind
  private openChooseUserModalWithChosenUsers(): void {
    const { navigation } = this.props
    navigation.navigate(AppScreens.CHOOSE_USERS_FOR_NEW_GROUP, {
      updateUsers: this.updateUsers,
      chosenUsers: this.users
    })
  }

  @autobind
  private renderItem({ item }: { item: IUser }): React.ReactElement {
    const { api } = this.props

    return (
      <TouchableOpacity onPress={this.openChooseUserModalWithChosenUsers}>
        <UserRow
          firstName={item.first_name}
          lastName={item.last_name}
          nickName={item.nick_name}
          avatarUrl={api.buildAvatarUrl(item.id, this.pictureToken)}
        />
      </TouchableOpacity>
    )
  }

  @autobind
  private async sendNewGroupRequestToServer(): Promise<void> {
    const { api, navigation, groupsModel } = this.props

    const usersIds = this.users.map((user: IUser) => user.id)

    const params: { name?: string, users: string[], } = { users: usersIds }
    if (!isEmpty(this.newGroupName)) {
      params.name = this.newGroupName
    }

    const newGroupResponse = await api.post("group", params, Api.BuildAuthorizationHeader(this.groupToken))
    groupsModel.addGroup(newGroupResponse.data)
    navigation.goBack()
  }

  @action.bound
  private updateGroupName(groupName: string): void {
    this.newGroupName = groupName
  }

  @action
  public async componentDidMount(): Promise<void> {
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"].accessToken
    this.groupToken = personalTokens["group-exorun"]
  }

  public render(): React.ReactNode {
    const isUsersNotEmpty = this.users.length > 0
    const buttonTx = isUsersNotEmpty ? "group.modify-participants" : "group.new-participants"

    return (
      <InputScrollView
        style={ROOT}
        useAnimatedScrollView
        showsVerticalScrollIndicator={false}
      >
        <TextField
          autoCapitalize="none"
          labelTx="group.name"
          placeholderTx="group.name"
          inputStyle={[INPUT_STYLE, BOTTOM_BORDER]}
          placeholderTextColor={color.palette.lightGrey}
          onChangeText={this.updateGroupName}
        />
        {renderIf(isUsersNotEmpty)((
          <View style={USER_LIST_CONTAINER}>
            <Text tx="group.chosen-users" preset="bold"/>
            <FlatList
              data={this.users}
              renderItem={this.renderItem}
              keyExtractor={keyExtractor}
            />
          </View>
        ))}
        <Button
          preset="primary"
          textPreset="primaryBoldLarge"
          tx={buttonTx}
          onPress={this.openChooseUserModal}
          style={MARGIN_TOP}
        />
        {renderIf(isUsersNotEmpty)((
          <Button
            preset="success"
            textPreset="primaryBoldLarge"
            tx="group.new"
            onPress={this.sendNewGroupRequestToServer}
            style={NEW_GROUP_SEND_BUTTON}
          />
        ))}
      </InputScrollView>
    )
  }

  @action.bound
  public updateUsers(chosenUsers: IUser[]): void {
    this.users = chosenUsers.slice()
  }
}
