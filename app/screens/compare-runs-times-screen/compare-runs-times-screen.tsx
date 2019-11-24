import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { Screen } from "@components/screen"
import { color, spacing } from "../../theme"
import { NavigationScreenProps } from "react-navigation"
import { Injection, InjectionProps } from "@services/injections"
import { action, observable } from "mobx"
import { IComparableTime, IPersonalTokens, ITime, IUser, IUserRun } from "@services/api"
import autobind from "autobind-decorator"
import { UserRow } from "@components/user-row"
import { load } from "@utils/keychain"
import { Server } from "@services/api/api.servers"
import { Button } from "@components/button"
import { AppScreens } from "@navigation/navigation-definitions"
import { first } from "lodash-es"
import { renderIf } from "@utils/render-if"

export interface ICompareRunsTimesScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  marginLeft: spacing[5],
  margin: spacing[2]
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  flex: 1
}

const TARGET_INFORMATIONS: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  flexDirection: "row"
}

const ACTION_BUTTON: ViewStyle = {
  flexDirection: "row",
  margin: spacing[3],
}

const TEXT_ACTION_BUTTON: TextStyle = {
  fontSize: 10,
  fontWeight: "bold",
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
  margin: spacing[2],
  padding: spacing[2]
}

const ROW: ViewStyle = {
  flexDirection: "row"
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

const keyExtractor = (item: any, index: number): string => item.id

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class CompareRunsTimesScreen extends React.Component<ICompareRunsTimesScreenProps> {
  @observable private hasSecondUserRunBeenChoose = false
  @observable private mixedTimes: IComparableTime[] = []
  @observable private myTimes: ITime[] = null
  @observable private myUserRun: IUserRun = null
  @observable private pictureToken: string
  @observable private targetUser: IUser = null
  @observable private readonly targetUserRun: IUserRun = this.props.navigation.getParam("targetUserRun")
  // tslint:disable-next-line: member-ordering
  @observable private readonly targetTimes: ITime[] = this.targetUserRun.times.slice()

  @autobind
  // tslint:disable-next-line:typedef
  private chooseMyUserRun(userRun: IUserRun) {
    this.myUserRun = userRun
    this.myTimes = this.myUserRun.times
    this.hasSecondUserRunBeenChoose = true
    this.compareTimes()
  }

  // tslint:disable-next-line:no-feature-envy
  @action.bound
  private compareTimes(): void {
    const myFirst = first(this.myTimes)
    const otherFirst = first(this.targetTimes)

    const copie: IComparableTime[] = []
    // tslint:disable-next-line:no-map-without-usage
    // tslint:disable-next-line:no-ignored-return no-map-without-usage
    this.myTimes.map((time: ITime) => {
      copie.push({
        id: time.id,
        check_point_id: time.check_point_id,
        my_current_time: time.current_time - myFirst.current_time,
        run_id: time.run_id,
        other_current_time: 0
      })
    })
    // tslint:disable-next-line:no-map-without-usage
    // tslint:disable-next-line:no-ignored-return no-map-without-usage
    this.targetTimes.map((time: ITime) => {
      const index = this.targetTimes.indexOf(time)
      if (copie[index] !== undefined) {
        copie[index].other_current_time = time.current_time - otherFirst.current_time
      }
    })
    this.mixedTimes = copie;
  }

  @action.bound
  private loadMyUserRun(userRun: IUserRun): void {
    this.myUserRun = userRun;
    this.myTimes = this.myUserRun.times.slice()
  }

  @autobind
  private onPressGoChooseSecondUserRun(): void {
    this.props.navigation.navigate(AppScreens.CHOOSE_USER_RUN, {
      chooseMyUserRun: this.chooseMyUserRun,
      targetProfile: this.targetUser,
      run_id: this.targetUserRun.run_id
    })
  }

  // tslint:disable-next-line:no-feature-envy
  @autobind
  // tslint:disable-next-line:prefer-function-over-method
  private renderTimes({item}: { item: IComparableTime }): React.ReactElement {
    let negative_diff = false;
    let diff;
    const myTime = new Date(
      0,
      0,
      0,
      (item.my_current_time / 3600),
      (item.my_current_time / 60) % 60,
      item.my_current_time % 60
    );
    const otherTime = new Date(
      0,
      0,
      0,
      (item.other_current_time / 3600),
      (item.other_current_time / 60) % 60,
      item.other_current_time % 60
    );
    if (item.my_current_time < item.other_current_time) {
      negative_diff = true;
      diff = new Date(
        0,
        0,
        0,
        ((item.other_current_time - item.my_current_time) / 3600),
        ((item.other_current_time - item.my_current_time) / 60) % 60,
        (item.other_current_time - item.my_current_time) % 60
      );
    } else {
      diff = new Date(
        0,
        0,
        0,
        ((item.my_current_time - item.other_current_time) / 3600),
        ((item.my_current_time - item.other_current_time) / 60) % 60,
        (item.my_current_time - item.other_current_time) % 60
      );
    }
    const formattedMyTime = `${myTime.getHours().toString()} h ${myTime.getMinutes().toString()} min ${myTime.getSeconds().toString()} sec`
    const formattedOtherTime = `${otherTime.getHours().toString()} h ${otherTime.getMinutes().toString()} min ${otherTime.getSeconds().toString()} sec`
    const formattedDiff = `${diff.getHours().toString()} h ${diff.getMinutes().toString()} min ${diff.getSeconds().toString()} sec`

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
        onPress={null}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{textTransform: "capitalize"}}
              text={`Reference : ${formattedOtherTime}`}
              preset="userRow"
            />
            <Text
              style={{textTransform: "capitalize", color: "red"}}
              text={`Temps comparé : ${formattedMyTime}`}
              preset="userRow"
            />
            <Text
              style={{textTransform: "capitalize", color: "cyan"}}
              text={`Différence ${formattedDiff}`}
              preset="userRow"
            />
          </View>
        </View>
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View>
            <Text preset="fieldLabel" text="Couru le :"/>
            {/*<Text preset="fieldLabel" text={formattedCreatedAt}/>*/}
          </View>
        </View>
      </TouchableOpacity>

    )
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    const personalTokens: IPersonalTokens = await load(Server.EXOSUITE_USERS_API_PERSONAL) as IPersonalTokens
    this.pictureToken = personalTokens["view-picture-exorun"].accessToken
    const TARGET = await api.get(`/user/${this.targetUserRun.user_id}/profile`).catch(onSearchError)
    this.targetUser = TARGET.data
    this.hasSecondUserRunBeenChoose = false
  }

  public render(): React.ReactNode {
    const { api } = this.props

    return (
      <Screen style={ROOT} preset="scroll">
          <View style={TITLE}>
            <Text preset="userRow">Comparaison de temps de courses</Text>
            <View style={TARGET_INFORMATIONS}>
              <Text preset="userRow">Cible : </Text>
              {
                this.targetUser && (
                  <UserRow
                    firstName={this.targetUser.first_name}
                    lastName={this.targetUser.last_name}
                    nickName={this.targetUser.nick_name}
                    avatarUrl={api.buildAvatarUrl(this.targetUser.id, this.pictureToken)}
                  />
                )
              }
            </View>
            { !this.hasSecondUserRunBeenChoose && (
              <Button onPress={this.onPressGoChooseSecondUserRun} style={ACTION_BUTTON}>
              <Text text={"Choisir mon temps à comparer"} style={TEXT_ACTION_BUTTON}/>
            </Button>
            )}
          </View>
        <FlatList
          data={this.mixedTimes}
          renderItem={this.renderTimes}
          keyExtractor={keyExtractor}
        />
      </Screen>
)
}
}
