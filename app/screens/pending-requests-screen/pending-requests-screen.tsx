import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, GestureResponderEvent, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "../../components/text"
import { Screen } from "../../components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { Injection, InjectionProps } from "@services/injections"
import { IPendingRequest, IPersonalTokens, IUser } from "@services/api"
import { renderIf } from "@utils/render-if"
import { ApiResponse } from "apisauce"
import autobind from "autobind-decorator"
import { noop } from "lodash-es"
import { action, observable } from "mobx"
import { UserRow } from "@components/user-row"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { IBoolFunction } from "@custom-types/functions"
import { AppScreens } from "@navigation/navigation-definitions"
import { Button } from "@components/button"
import { FontawesomeIcon } from "@components/fontawesome-icon"
import { palette } from "@theme/palette"

export interface IPendingRequestsScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  paddingLeft: spacing[5],
  flexDirection: "column",
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
  justifyContent: "flex-end",
  paddingRight: spacing[4]
}

const TIME_CONTAINER: ViewStyle = {
  backgroundColor: color.backgroundDarkerer,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
//  margin: spacing[2],
  padding: spacing[2]
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const ACTION_BUTTON: ViewStyle = {
  flexDirection: "row",
  marginHorizontal: spacing[1],
  width: 100,
}

const TEXT_ACTION_BUTTON: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
}

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right",
  flex: 1
}

const FOLLOW_ICON: ViewStyle = {
  paddingRight: spacing[1]
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

const keyExtractor = (item: IPendingRequest, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class PendingRequestsScreen extends React.Component<IPendingRequestsScreenProps> {
  private currentPage: number
  private lastQuery: string
  private maxPage: number
  private onEndReachedCalledDuringMomentum = true
  @observable private pictureToken: string
  @observable private requests: IPendingRequest[] = []
  private readonly routeAPIGetPendings = "user/me/pending_requests"

  @action
  private async acceptRequest(item: IPendingRequest): Promise<void> {
    const { api } = this.props;

    await api.post(`user/me/friendship/${item.id}/accept`);
    const POS = this.requests.indexOf(item);
    this.requests = this.requests.splice(POS, 1);
    await this.onUserTypeSearch("*")
  }

  @action
  private async declineRequest(item: IPendingRequest): Promise<void> {
    const { api } = this.props;

    await api.post(`user/me/friendship/${item.id}/decline`);
    const POS = this.requests.indexOf(item);
    this.requests = this.requests.splice(POS, 1);
    await this.onUserTypeSearch("*")
  }

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

    const results = await api.get(this.routeAPIGetPendings, queriesParams).catch(onSearchError)
    this.currentPage = results.data.current_page
    if (!neededNextPage) {
      this.maxPage = results.data.last_page
      this.lastQuery = query
      this.requests = results.data.data
    } else {
      this.requests.push(...results.data.data)
    }
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props;
    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens;

    this.pictureToken = personalTokens["view-picture-exorun"].accessToken;
    const RESULT = await api.get(this.routeAPIGetPendings).catch(onSearchError);
    this.requests.push(...RESULT.data.data);
    await this.onUserTypeSearch("*");
  }

  public render(): React.ReactNode {
    return (
      <Screen style={ROOT} preset="scroll">
        <View style={TITLE}>
          <View style={{flexDirection: "row", backgroundColor: color.palette.backgroundDarkerer}}>
            <View style={HEADER_PICKER}>
              <View style={HEADER_TITLE}>
                  <Text
                    preset="header"
                    text={`Vos requêtes en attentes`}
                    style={{ alignSelf: "center" }}
                  />
              </View>
            </View>
          </View>
        </View>
        <FlatList
          data={this.requests}
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
  public renderItem({item}: { item: IPendingRequest }): React.ReactElement {
    const { api } = this.props;

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
        onPress={this.goToProfile(item.user)}
      >
        <UserRow
          firstName={item.user.first_name}
          lastName={item.user.last_name}
          nickName={item.user.nick_name}
          avatarUrl={api.buildAvatarUrl(item.user.id, this.pictureToken)}
        />
        <View style={ROW}>
          <Text style={{marginRight: 10}} preset="userRow" text={"Souhaite devenir votre ami(e)"}/>
          {/* tslint:disable-next-line:jsx-no-lambda typedef */}
          <Button onPress={(event: GestureResponderEvent) => this.acceptRequest(item)} style={ACTION_BUTTON}>
            <FontawesomeIcon color={palette.white} name="check" style={FOLLOW_ICON}/>
            <Text tx={"profile.accept"} style={TEXT_ACTION_BUTTON}/>
          </Button>
          {/* tslint:disable-next-line:typedef jsx-no-lambda */}
          <Button onPress={(event: GestureResponderEvent) => this.declineRequest(item)} style={ACTION_BUTTON}>
            <FontawesomeIcon color={palette.white} name="times" style={FOLLOW_ICON}/>
            <Text tx={"profile.decline"} style={TEXT_ACTION_BUTTON}/>
          </Button>
        </View>
      </TouchableOpacity>
    )
  }
}
