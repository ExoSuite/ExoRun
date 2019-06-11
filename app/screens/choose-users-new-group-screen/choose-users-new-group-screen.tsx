import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { color, spacing } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { Injection, InjectionProps } from "@services/injections"
import { DarkTheme, Searchbar } from "react-native-paper"
import autobind from "autobind-decorator"
import { action, observable, runInAction } from "mobx"
import { IPersonalTokens, IUser } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { ApiResponse } from "apisauce"
import { UserRow } from "@components/user-row"
import { IVoidFunction } from "@types"
import { translate } from "@i18n/translate"
import { Text } from "@components/text"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { Avatar, DefaultRnpAvatarSize } from "@components/avatar"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { isEmpty, noop } from "lodash-es"
import { RightNavigationButton } from "@navigation/components/right-navigation-button"

interface IChooseUsersNewGroupNavProps {
  chosenUsers?: IUser[]
  updateUsers(chosenUsers: IUser[]): void
}

export interface IChooseUsersNewGroupProps extends NavigationScreenProps<IChooseUsersNewGroupNavProps>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1
}

const SEARCH: ViewStyle = {
  backgroundColor: color.backgroundDarkerer
}

const TEXT_CONTAINER: ViewStyle = {
  alignSelf: "center",
  marginTop: spacing[2],
  flexShrink: 1,
  flex: 1
}

const CENTERED_TEXT: TextStyle = {
  textAlign: "center"
}

const CAPITALIZED: TextStyle = {
  textTransform: "capitalize"
}

const CHOSEN_USER_CONTAINER: ViewStyle = {
  width: 110,
  minHeight: 150,
  justifyContent: "center",
  alignItems: "center",
  margin: spacing[3]
}

const DELETE_CHOSEN_ICON: ViewStyle = {
  position: "absolute",
  top: 0,
  right: 0
}

const placeholderTx = translate("common.search")

// @ts-ignore
const onSearchError = (): ApiResponse<any> => (
  {
    data: {
      data: [],
      current_page: Number.MAX_SAFE_INTEGER
    }
  }
)

const keyExtractor = (item: IUser, index: number): string => item.id
const HeaderRight = RightNavigationButton({
  icon: "check", color: color.palette.green, wantGoBack: true
})

/**
 * SearchScreen will handle the search of an user
 */
@inject(Injection.Api)
@observer
export class ChooseUsersNewGroupScreen extends React.Component<IChooseUsersNewGroupProps> {
  @observable private chosenUsers: IUser[] = []
  private currentPage: number
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  @observable private pictureToken: string
  @observable private users: IUser[] = []

  public static navigationOptions = {
    headerTitle: <Text tx="group.new-participants" preset="lightHeader"/>,
    headerLeft: NavigationBackButtonWithNestedStackNavigator({
      iconName: "chevron-down"
    }),
    headerRight: <HeaderRight/>
  }

  @autobind
  private chooseUser(user: IUser): IVoidFunction {
    return (): void => {
      runInAction(() => {
        if (isEmpty(this.chosenUsers.find((chosenUser: IUser): boolean => chosenUser.id === user.id))) {
          this.chosenUsers.push(user)
          this.chosenUsers = this.chosenUsers.slice()
        }
      })
    }
  }

  @autobind
  private onEndReached(): void {
    if (this.currentPage < this.maxPage && !this.onEndReachedCalledDuringMomentum) {
      this.currentPage += 1
      this.onUserTypeToSearch(this.lastQuery, true).catch(noop)
    }
  }

  @autobind
  private onMomentumScrollBegin(): void {
    this.onEndReachedCalledDuringMomentum = false
  }

  @action.bound
  // tslint:disable-next-line: typedef
  private async onUserTypeToSearch(query: string, needNextPage = false): Promise<void> {
    const { api } = this.props

    if (!query) {
      // tslint:disable-next-line: no-parameter-reassignment
      query = "*"
    }

    const queriesParams: { page?: number, text: string } = {
      text: query
    }

    if (needNextPage) {
      queriesParams.page = this.currentPage
    }

    const results = await api.get("user/search", queriesParams).catch(onSearchError)
    this.currentPage = results.data.current_page
    if (!needNextPage) {
      this.maxPage = results.data.last_page
      this.lastQuery = query
      this.users = results.data.data
    } else {
      this.users.push(...results.data.data)
    }
  }

  // tslint:disable-next-line: no-feature-envy
  @autobind
  private renderChosenUser({ item }: { item: IUser }): React.ReactElement {
    const { api } = this.props

    return (
      <TouchableOpacity
        style={CHOSEN_USER_CONTAINER}
        onPress={this.unChooseUser(item)}
      >
        <Avatar
          size={DefaultRnpAvatarSize}
          urlFromParent
          avatarUrl={api.buildAvatarUrl(item.id, this.pictureToken)}
          disableOnPress
        />
        <View style={TEXT_CONTAINER}>
          <Text
            preset="lightHeader"
            text={`${item.first_name} ${item.last_name}`}
            style={[CENTERED_TEXT, CAPITALIZED]}
          />
          <Text preset="nicknameLight" text={item.nick_name} style={CENTERED_TEXT}/>
        </View>
        <FontawesomeIcon
          name="times"
          color={color.palette.orange}
          style={DELETE_CHOSEN_ICON}
          size={21}
        />
      </TouchableOpacity>
    )
  }

  @autobind
  private renderItem({ item }: { item: IUser }): React.ReactElement {
    const { api } = this.props

    return (
      <TouchableOpacity onPress={this.chooseUser(item)}>
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
  private unChooseUser(user: IUser): IVoidFunction {
    return (): void => {
      runInAction(() => {
        this.chosenUsers = this.chosenUsers.filter((chosenUser: IUser): boolean => chosenUser.id !== user.id)
      })
    }
  }

  @action
  public async componentDidMount(): Promise<void> {
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"].accessToken
    await this.onUserTypeToSearch("*")
    const chosenUsers = this.props.navigation.getParam("chosenUsers")
    if (chosenUsers) {
      this.chosenUsers = chosenUsers
    }
  }

  public componentWillUnmount(): void {
    const { navigation } = this.props
    const updateUsers = navigation.getParam("updateUsers")
    if (updateUsers) {
      updateUsers(this.chosenUsers)
    }
  }

  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixed">
        <Searchbar
          placeholder={placeholderTx}
          onChangeText={this.onUserTypeToSearch}
          style={SEARCH}
          theme={DarkTheme}
        />
        <View style={{ marginTop: spacing[2] }}>
          <FlatList
            data={this.chosenUsers}
            renderItem={this.renderChosenUser}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={{padding: spacing[2]}}>
          <Text tx="group.users" preset="bold" style={{ marginLeft: spacing[2] }}/>
          <FlatList
            data={this.users}
            renderItem={this.renderItem}
            keyExtractor={keyExtractor}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={this.onMomentumScrollBegin}
          />
        </View>

      </Screen>
    )
  }
}
