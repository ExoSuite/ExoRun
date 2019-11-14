import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native"
import { Screen, Text } from "@components"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { Injection, InjectionProps } from "@services/injections"
import { IFriendship, IPersonalTokens, IUser } from "@services/api"
import { action, observable } from "mobx"
import { UserRow } from "@components/user-row"
import autobind from "autobind-decorator"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { IBoolFunction } from "@custom-types/functions"
import { AppScreens } from "@navigation/navigation-definitions"
import { noop } from "lodash-es"
import { renderIf } from "@utils/render-if"
import { ApiResponse } from "apisauce"

export interface IFriendshipsListScreenProps extends NavigationScreenProps<{}>, InjectionProps {
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

const ROOT: ViewStyle = {
  backgroundColor: color.background
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  paddingLeft: spacing[5],
  flexDirection: "column",
}

const FOLLOW_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  padding: spacing[2]
}

const HEADER_PICKER: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: color.palette.backgroundDarkerer
}

const HEADER_TITLE: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: color.palette.backgroundDarkerer,
  paddingRight: spacing[4]
}

const keyExtractor = (item: IFriendship, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class FriendshipsListScreen extends React.Component<IFriendshipsListScreenProps> {
  private currentPage: number
  @observable private friends: IFriendship[] = []
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  @observable private pictureToken: string
  private routeAPIGetFollowers: string
  // @ts-ignore
  @observable private target = this.props.navigation.getParam("me")
  private targetProfile: IUser = {} as IUser

  @autobind
  private goToProfile(user: IUser): IBoolFunction {
    return (): boolean => this.props.navigation.push(AppScreens.USER_PROFILE,
      {
        user,
        pictureToken: this.pictureToken
      })
  }

  @autobind
  private onEndReached(): void {
    if (this.currentPage < this.maxPage && !this.onEndReachedCalledDuringMomentum) {
      this.currentPage += 1
      this.onUserTypeSearch(this.lastQuery, true).catch(noop)
    }
  }

  @autobind
  private onMomentumScrollBegin(): void {
    this.onEndReachedCalledDuringMomentum = false
  }

  @action.bound
  // tslint:disable-next-line:typedef
  private async onUserTypeSearch(query: string, neededNextPage = false): Promise<void> {
    const { api } = this.props

    if (!query) {
      // tslint:disable-next-line:no-parameter-reassignment
      query = "*"
    }

    const queriesParams: { page?: number, text: string } = {
      text: query
    }

    if (neededNextPage) {
      queriesParams.page = this.currentPage
    }

    const results = await api.get(this.routeAPIGetFollowers, queriesParams).catch(onSearchError)
    this.currentPage = results.data.current_page
    if (!neededNextPage) {
      this.maxPage = results.data.last_page
      this.lastQuery = query
      this.friends = results.data.data
    } else {
      this.friends.push(...results.data.data)
    }
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props;
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens

    this.pictureToken = personalTokens["view-picture-exorun"].accessToken
    this.routeAPIGetFollowers = "user/me/friendship";

    if (!this.target) {
      // @ts-ignore
      this.target = this.props.navigation.getParam("userProfile");
      this.routeAPIGetFollowers = `user/${this.target.id}/friendship`;
      this.targetProfile = this.target;
    } else {
      const ME = await api.get("user/me/").catch(onSearchError);
      this.targetProfile = {...ME.data};
    }
    const RESULT = await api.get(this.routeAPIGetFollowers).catch(onSearchError);
    this.friends.push(...RESULT.data.data);
    await this.onUserTypeSearch("*")

  }

  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="scroll">
        <View style={TITLE}>
          <View style={{flexDirection: "row", backgroundColor: color.palette.backgroundDarkerer}}>
            <View style={HEADER_PICKER}>
              {/* SEARCH BAR */}
              <View style={HEADER_TITLE}>
                {renderIf.if(this.targetProfile.first_name === undefined)(
                  <Text preset="header" text={" "} style={{ alignSelf: "center" }}/>
                ).elseIf(this.props.navigation.getParam("me") === true)(
                  <Text preset="header" text={"Mes Amis"} style={{ alignSelf: "center" }}/>
                ).else(
                  <Text
                    preset="header"
                    text={`Liste d'amis de ${this.targetProfile.first_name} ${this.targetProfile.last_name}`}
                    style={{ alignSelf: "center" }}
                  />
                ).evaluate()}
              </View>
            </View>
          </View>
        </View>
        <FlatList
          data={this.friends}
          keyExtractor={keyExtractor}
          renderItem={this.renderItem}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
        />
      </Screen>
    )
  }

  // tslint:disable-next-line: no-feature-envy
  @autobind
  public renderItem({item} : { item: IFriendship }): React.ReactElement {
    const { api } = this.props;

    return (
      <TouchableOpacity
        style={FOLLOW_CONTAINER}
        onPress={this.goToProfile(item.friend)}
      >
        <UserRow
          firstName={item.friend.first_name}
          lastName={item.friend.last_name}
          nickName={item.friend.nick_name}
          avatarUrl={api.buildAvatarUrl(item.friend.id, this.pictureToken)}
        />
      </TouchableOpacity>
    )
  }
}
