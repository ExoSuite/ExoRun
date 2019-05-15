import * as React from "react"
import { observer } from "mobx-react"
import { FlatList, TouchableOpacity, ViewStyle } from "react-native"
import { Screen } from "@components/screen"
import { color } from "@theme"
import { NavigationScreenProps } from "react-navigation"
import { inject } from "mobx-react/native"
import { Injection, InjectionProps } from "@services/injections"
import { DarkTheme, Searchbar } from "react-native-paper"
import autobind from "autobind-decorator"
import { action, observable } from "mobx"
import { IPersonalTokens, IUser } from "@services/api"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { ApiResponse } from "apisauce"
import { UserRow } from "@components/user-row"
import { AppScreens } from "@navigation/navigation-definitions"
import { IBoolFunction } from "@types"

export interface ISearchScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1
}

const SEARCH: ViewStyle = {
  backgroundColor: color.backgroundDarkerer
}

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

/**
 * SearchScreen will handle the search of an user
 */
@inject(Injection.Api)
@observer
export class SearchScreen extends React.Component<ISearchScreenProps> {
  private currentPage: number
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  @observable private pictureToken: string
  @observable private users: IUser[] = []

  @autobind
  private goToProfile(user: IUser): IBoolFunction {
    return (): boolean => this.props.navigation.navigate(AppScreens.USER_PROFILE,
      {
        user,
        pictureToken: this.pictureToken
      })
  }

  @autobind
  private onEndReached(): void {
    if (this.currentPage < this.maxPage && !this.onEndReachedCalledDuringMomentum) {
      this.currentPage += 1
      this.onUserTypeToSearch(this.lastQuery, true).catch()
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
  private renderItem({ item }: { item: IUser }): React.ReactElement {
    const { api } = this.props

    return (
      <TouchableOpacity onPress={this.goToProfile(item)}>
        <UserRow
          firstName={item.first_name}
          lastName={item.last_name}
          nickName={item.nick_name}
          avatarUrl={api.buildAvatarUrl(item.id, this.pictureToken)}
        />
      </TouchableOpacity>
    )
  }

  @action
  public async componentDidMount(): Promise<void> {
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"].accessToken
  }

  // tslint:disable-next-line: no-feature-envy
  public render(): React.ReactNode {

    return (
      <Screen style={ROOT} preset="fixed">
        <Searchbar
          placeholder="Search"
          onChangeText={this.onUserTypeToSearch}
          style={SEARCH}
          theme={DarkTheme}
        />
        <FlatList
          data={this.users}
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
        />
        {/*<Screen preset="scroll">
         <UserRow avatarUrl={null} firstName="Jean" lastName="Michel" nickName="Toto"/>
        </Screen>*/}
      </Screen>
    )
  }
}
