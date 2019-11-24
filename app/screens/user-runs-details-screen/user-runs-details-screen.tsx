import * as React from "react"
import { inject, observer } from "mobx-react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text, Screen } from "@components"
import { color, spacing } from "../../theme"
import { NavigationActions, NavigationScreenProps } from "react-navigation"
import moment from "moment"
import { action, observable } from "mobx"
import { ITime, IUserRun } from "@services/api"
import { ApiResponse } from "apisauce"
import { Injection, InjectionProps } from "@services/injections"
import autobind from "autobind-decorator"
import { FAB } from "react-native-paper"
import { AppScreens } from "@navigation/navigation-definitions"
import { IBoolFunction } from "@custom-types/functions"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"

export interface IUserRunsDetailsScreenProps extends NavigationScreenProps<{}>, InjectionProps {
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

const TEXT_ALIGN_RIGHT: TextStyle = {
  textAlign: "right"
}

const ROW: ViewStyle = {
  flexDirection: "row"
}

const fab: ViewStyle = {
  position: "absolute",
  right: 0,
  bottom: 0,
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
export class UserRunsDetailsScreen extends React.Component<IUserRunsDetailsScreenProps> {
  private cp_id = 0
  @observable private isFabOpen = false
  private nbr_cp: number
  private starting_timestamp: number
  // @ts-ignore
  private readonly userRun : IUserRun = this.props.navigation.getParam("item")
  @observable private readonly userRunTimes : ITime[] = this.userRun.times.slice()

  // tslint:disable-next-line: typedef
  public static navigationOptions = ({ navigation }) => ({
    headerLeft: NavigationBackButtonWithNestedStackNavigator(),
  })

  @autobind
  private changeIsFabOpen(): any {
    this.isFabOpen = !this.isFabOpen
  }

  @autobind
  private onPressCompare(): void {
    this.props.navigation.navigate(
      AppScreens.COMPARE_USER_RUN,
      {
        targetUserRun: this.userRun,
      }
    )
  }

  @autobind
  private async onPressDelete(): Promise<void> {
    const { api } = this.props

    await api.delete(`/user/me/run/${this.userRun.run_id}/user_run/${this.userRun.id}`).catch(onSearchError)
    // @ts-ignore
    this.props.navigation.getParam("deleteUserRun")(this.userRun)
    this.props.navigation.dispatch(NavigationActions.back())
  }

  @autobind
  // tslint:disable-next-line:prefer-function-over-method
  private renderTimes({item}: { item: ITime }): React.ReactElement {
    const formattedCreatedAt = moment(item.created_at).format("LLL");
    let checkpoint_name: string
    let checkpoint_time = 0
    if (this.starting_timestamp) {
      checkpoint_time = item.current_time - this.starting_timestamp
    }
    const time = new Date(
      0,
      0,
      0,
      (checkpoint_time / 3600),
      (checkpoint_time / 60) % 60,
      checkpoint_time % 60
    );

    if (this.cp_id < this.nbr_cp) {
      this.cp_id += 1
      checkpoint_name = `Checkpoint ${this.cp_id}`
    }
    if (this.cp_id === this.nbr_cp) {
      checkpoint_name = `Arrivée`
    }
    const formattedTime = `${time.getHours().toString()} h ${time.getMinutes().toString()} min ${time.getSeconds().toString()} sec`

    return (
      <TouchableOpacity
        style={TIME_CONTAINER}
      >
        <View style={ROW}>
          <View style={{marginLeft: spacing[2], justifyContent: "center"}}>
            <Text
              style={{textTransform: "capitalize"}}
              text={checkpoint_name}
              preset="userRow"
            />
          </View>
        </View>
        <View style={{...ROW, flex: 1, marginTop: spacing[3]}}>
          <View>
            <Text preset="default" text="Temps :"/>
            <Text preset="default" text={formattedTime}/>
          </View>
          <View style={{alignSelf: "flex-end", flex: 1}}>
            <Text preset="fieldLabel" tx="common.createdAt" style={TEXT_ALIGN_RIGHT}/>
            <Text preset="fieldLabel" text={formattedCreatedAt} style={TEXT_ALIGN_RIGHT}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  @action
  public componentDidMount(): void {
    const elem = this.userRunTimes.shift()
    this.starting_timestamp = elem.current_time

    this.nbr_cp = this.userRunTimes.length
  }

  public render(): React.ReactNode {

    const formatted_createdAt = moment(this.userRun.created_at).format("LLL")

    return (
      <Screen style={ROOT} preset="scroll">
        <View>
          <View style={TITLE}>
            <Text preset="userRow">{`Course du ${formatted_createdAt}`}</Text>
          </View>
        </View>
        <FlatList
          data={this.userRunTimes}
          renderItem={this.renderTimes}
          keyExtractor={keyExtractor}
        />
        {/* tslint:disable-next-line:use-simple-attributes */}
        <FAB.Group
          style={fab}
          actions={[
            { icon: "delete", label: "Supprimer", onPress: this.onPressDelete},
            { icon: "timer", label: "Comparer à mes temps", onPress: this.onPressCompare},
          ]}
          icon={this.isFabOpen ? "minus" : "plus"}
          open={this.isFabOpen}
          onStateChange={this.changeIsFabOpen}
        />
      </Screen>

    )
  }
}
