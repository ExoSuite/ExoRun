import * as React from "react"
import { inject, observer } from "mobx-react"
import { View, ViewStyle } from "react-native"
import { Text } from "@components/text"
import { Screen } from "@components/screen"
import { color, spacing } from "../../theme"
import { NavigationActions, NavigationScreenProps } from "react-navigation"
import { Injection, InjectionProps } from "@services/injections"
import { action, observable } from "mobx"
import { IRun, IUser } from "@services/api"
import { ApiResponse } from "apisauce"
import { isEmpty } from "lodash-es"
import moment from "moment"
import { FAB } from "react-native-paper"
import autobind from "autobind-decorator"
import { IBoolFunction } from "@types"
import { AppScreens } from "@navigation/navigation-definitions"
import { NavigationBackButtonWithNestedStackNavigator } from "@navigation/components"
import { FontawesomeIcon } from "@components/fontawesome-icon"

export interface IRunDetailsScreenProps extends NavigationScreenProps<{}>, InjectionProps {
}

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
}

const TITLE: ViewStyle = {
  backgroundColor: color.palette.backgroundDarker,
  paddingLeft: spacing[5],
//  margin: spacing[2],
  flexDirection: "row",
  flex: 1,
}

const CREATED_BY: ViewStyle = {
  flex: 1,
  backgroundColor: color.palette.backgroundDarkerer,
  flexDirection: "row",
}

const DESCRIPTION: ViewStyle = {
  flex: 15,
  backgroundColor: color.palette.backgroundDarkerer,
  padding: spacing[3],
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
      current_page: Number.MAX_SAFE_INTEGER,
    },
  }
)

// tslint:disable-next-line:completed-docs
@inject(Injection.Api)
@observer
export class RunDetailsScreen extends React.Component<IRunDetailsScreenProps> {
  @observable private isFabOpen = false
  // @ts-ignore
  @observable private readonly run: IRun = this.props.navigation.getParam("item")
  // @ts-ignore
  @observable private runCreator: IUser = {} as IUser
  // @ts-ignore
  private readonly targetProfile: IUser = this.props.navigation.getParam("targetProfile")

  // tslint:disable-next-line: typedef
  public static navigationOptions = ({ navigation }) => ({
    headerLeft: NavigationBackButtonWithNestedStackNavigator(),
  })

  @autobind
  private changeIsFabOpen(): any {
    this.isFabOpen = !this.isFabOpen
  }

  @autobind
  private goToAugmentedReality(): void {
    this.props.navigation.navigate(AppScreens.AUGMENTED_REALITY)
  }

  @autobind
  private goToCheckpointsView(): void {
    const creatorId = this.runCreator.id ?? this.targetProfile.id

    this.props.navigation.navigate(AppScreens.MAP, {
      runId: this.run.id,
      creatorId,
    })
  }

  @autobind
  private async onPressDelete(): Promise<void> {
    const { api } = this.props

    await api.delete(`/user/me/run/${this.run.id}`).catch(onSearchError)
    // @ts-ignore
    this.props.navigation.getParam("deleteRun")(this.run)
    this.props.navigation.dispatch(NavigationActions.back())
  }

  @autobind
  private onPressGoToRunTimes(run_id: string, targetProfile: IUser): IBoolFunction {

    return (): boolean => this.props.navigation.navigate(
      AppScreens.RUNS_TIMES,
      {
        run_id,
        targetProfile,
        me: this.props.navigation.getParam("me"),
      },
    )
  }

  @action
  public async componentDidMount(): Promise<void> {
    const { api } = this.props

    const result = await api.get(`/user/${this.run.creator_id}/profile`).catch(onSearchError)
    this.runCreator = { ...result.data }
  }

  public render(): React.ReactNode {
    const formattedCreatedAt = moment(this.run.created_at).format("LLL")
    let creator_name: string
    !isEmpty(this.runCreator) ? creator_name = `${this.runCreator.first_name} ${this.runCreator.last_name}` : creator_name = ""

    return (
      <View style={{ flex: 1 }}>
        <Screen style={ROOT} preset="fixed">
          <View style={TITLE}>
            <View style={{ flex: 1, backgroundColor: color.palette.backgroundDarkerer }}>
              <Text preset="header" text={this.run.name} style={{ marginTop: spacing[1] }}/>
            </View>
            <View style={CREATED_BY}>
              <Text preset="lightHeader" text="Créé par : " style={{ marginTop: spacing[1] }}/>
              <Text preset="lightHeader" text={creator_name} style={{ marginTop: spacing[1] }}/>
            </View>
          </View>
          <View style={DESCRIPTION}>
            <Text preset="lightHeader" text="Description de la course :" style={{ textDecorationLine: "underline" }}/>
            <Text preset="default" text={this.run.description} style={{ marginTop: spacing[3] }}/>
            <Text preset="fieldLabel" text={`Créé le : ${formattedCreatedAt}`} style={{ marginTop: spacing[5] }}/>
          </View>
        </Screen>
        {/*tslint:disable-next-line:use-simple-attributes*/}
        <FAB.Group
          style={fab}
          actions={[
            { icon: "delete", label: "Supprimer", onPress: this.onPressDelete },
            {
              icon: "star", label: "Temps de courses",
              onPress: this.onPressGoToRunTimes(this.run.id, this.targetProfile),
            },
            {
              icon: "vr", label: "Réalité augmentée", onPress: this.goToAugmentedReality
            },
            {
              icon: "point", label: "Voir les points de passage", onPress: this.goToCheckpointsView
            }
          ]}
          icon={this.isFabOpen ? "minus" : "plus"}
          open={this.isFabOpen}
          onStateChange={this.changeIsFabOpen}
        />
      </View>
    )
  }
}
